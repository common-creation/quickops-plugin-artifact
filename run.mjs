import fs from "node:fs/promises";
import module from "node:module";
import process from "node:process";
import AdmZip from "adm-zip";

const require = module.createRequire(import.meta.url);
const packageJson = require("./package.json");

console.log("run:", `common-creation/quickops-plugin-artifact@${packageJson.version}`);

const { QUICKOPS_BASE_URL, QUICKOPS_TOKEN, ARTIFACT_PATH } = process.env;
if (!QUICKOPS_BASE_URL) {
  throw new Error("missing environment variable: 'QUICKOPS_BASE_URL'");
}
if (!QUICKOPS_TOKEN) {
  throw new Error("missing environment variable: 'QUICKOPS_TOKEN'");
}
if (!ARTIFACT_PATH) {
  throw new Error("missing environment variable: 'ARTIFACT_PATH'");
}

let fileName = process.env.ARTIFACT_NAME || "artifact.zip";
if (!fileName.endsWith(".zip")) {
  fileName += ".zip";
}

console.log("create zip:", ARTIFACT_PATH, "👉", fileName);

const stat = await fs.stat(ARTIFACT_PATH);
const zip = new AdmZip();
if (stat.isDirectory()) {
  zip.addLocalFolder(ARTIFACT_PATH);
} else {
  zip.addLocalFile(ARTIFACT_PATH);
}

const signRequestUrl = `${QUICKOPS_BASE_URL}/v1/context/artifact`;
const signRes = await fetch(signRequestUrl, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${QUICKOPS_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": `common-creation_quickops-plugin-artifact/${packageJson.version}`,
  },
  body: JSON.stringify({
    key: fileName,
  }),
});
const { url: putUrl } = await signRes.json();

console.log("upload url:", `${putUrl}`.substring(0, 50), `${putUrl}`.length > 50 ? "..." : "");

const putRes = await fetch(putUrl, {
  method: "PUT",
  headers: {
    "User-Agent": `common-creation_quickops-plugin-artifact/${packageJson.version}`,
    "Content-Type": "application/zip",
  },
  body: zip.toBuffer(),
});

console.log("upload response status:", putRes.status);