// Emergent object storage client (Node). Mirrors backend/object_storage.py.
const APP_NAME = "dunzo-platform";

function storageUrl() {
  const base = (process.env.INTEGRATION_PROXY_URL || "").trim() || "https://integrations.emergentagent.com";
  return base.replace(/\/+$/, "") + "/objstore/api/v1/storage";
}

const MIME_TYPES = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif",
  webp: "image/webp", pdf: "application/pdf", json: "application/json",
  csv: "text/csv", txt: "text/plain", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

let storageKey = null;

async function initStorage(force = false) {
  if (storageKey && !force) return storageKey;
  const resp = await fetch(`${storageUrl()}/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emergent_key: process.env.EMERGENT_LLM_KEY }),
  });
  if (!resp.ok) throw new Error(`storage init failed: ${resp.status}`);
  storageKey = (await resp.json()).storage_key;
  return storageKey;
}

async function putObject(path, data, contentType) {
  const put = (key) => fetch(`${storageUrl()}/objects/${path}`, {
    method: "PUT",
    headers: { "X-Storage-Key": key, "Content-Type": contentType },
    body: data,
  });
  let resp = await put(await initStorage());
  if (resp.status === 404) resp = await put(await initStorage(true));
  if (!resp.ok) throw new Error(`put failed: ${resp.status}`);
  return resp.json();
}

async function getObject(path) {
  const get = (key) => fetch(`${storageUrl()}/objects/${path}`, { headers: { "X-Storage-Key": key } });
  let resp = await get(await initStorage());
  if (resp.status === 404) resp = await get(await initStorage(true));
  if (!resp.ok) throw new Error(`get failed: ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  return { data: buf, contentType: resp.headers.get("Content-Type") || "application/octet-stream" };
}

const mimeFor = (name) => MIME_TYPES[(name.split(".").pop() || "").toLowerCase()] || "application/octet-stream";
const humanSize = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`);

export { APP_NAME, initStorage, putObject, getObject, mimeFor, humanSize };
