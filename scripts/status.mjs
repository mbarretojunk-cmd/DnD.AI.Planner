/*
 * On-demand status snapshot for Claude.
 * Reads the game data with the secret key, gzips it and encrypts it to the
 * public key passed in STATUS_PUBKEY (RSA-OAEP + AES-256-GCM). Only the
 * holder of the matching private key can read the output, so it is safe to
 * print in this public repo's job log.
 */
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import zlib from "node:zlib";

const { SUPABASE_URL, SUPABASE_SECRET_KEY: SECRET, STATUS_PUBKEY } = process.env;
const fail = m => { console.log("::error::" + m); process.exit(1); };
if (!SECRET) fail("SUPABASE_SECRET_KEY secret is missing");
if (!STATUS_PUBKEY) fail("No public key given");

const SKIP = /^(push|pushlog|dm)\//;
const sb = createClient(SUPABASE_URL, SECRET, { auth: { persistSession: false } });
const rows = []; let from = 0;
for (;;) {
  const { data, error } = await sb.from("docs").select("user_id,path,data").range(from, from + 999);
  if (error) fail("Read failed: " + error.message);
  rows.push(...data); if (data.length < 1000) break; from += 1000;
}
const byUser = {};
rows.forEach(r => { if (!SKIP.test(r.path)) (byUser[r.user_id] = byUser[r.user_id] || {})[r.path] = r.data; });
const users = Object.values(byUser).sort((a, b) => Object.keys(b).length - Object.keys(a).length);
if (!users.length) fail("No data found");
const plain = zlib.gzipSync(JSON.stringify({ exportedAt: new Date().toISOString(), docs: users[0] }), { level: 9 });

const pub = crypto.createPublicKey({ key: Buffer.from(STATUS_PUBKEY, "base64"), format: "der", type: "spki" });
const key = crypto.randomBytes(32), iv = crypto.randomBytes(12);
const wrapped = crypto.publicEncrypt({ key: pub, oaepHash: "sha256", padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, key);
const c = crypto.createCipheriv("aes-256-gcm", key, iv);
const ct = Buffer.concat([c.update(plain), c.final()]);
const len = Buffer.alloc(2); len.writeUInt16BE(wrapped.length);
const blob = Buffer.concat([len, wrapped, iv, c.getAuthTag(), ct]).toString("base64");
const size = 3500, parts = Math.ceil(blob.length / size);
if (parts > 9) fail("Snapshot too large: " + parts + " parts");
for (let i = 0; i < parts; i++) console.log(`::notice title=status ${i + 1}/${parts}::` + blob.slice(i * size, (i + 1) * size));
