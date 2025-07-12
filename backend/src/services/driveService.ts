import fetch from "node-fetch";
import type { Response as FetchResponse } from "node-fetch";
import stream from "stream";
import path from "path";
import { drive_v3 } from "@googleapis/drive";
import { GoogleAuthService } from "./googleAuthService";

/**
 * Find a folder ID by name in Google Drive
 */
async function findFolderId(
  drive: drive_v3.Drive,
  folderName: string
): Promise<string | undefined> {
  const res = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id)",
    spaces: "drive",
  });

  const id = res.data.files?.[0]?.id;
  return typeof id === "string" ? id : undefined;
}

/**
 * Get or create a folder and return its ID
 */
async function getOrCreateFolder(
  drive: drive_v3.Drive,
  folderName: string
): Promise<string> {
  const folderId = await findFolderId(drive, folderName);
  if (folderId) return folderId;

  const res = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  if (!res.data.id) throw new Error("Failed to create folder in Google Drive.");
  return res.data.id;
}

/**
 * Extract filename from Content-Disposition header or fallback to URL
 */
function extractFilename(
  res: FetchResponse,
  url: string,
  fallback: string
): string {
  const disposition = res.headers.get("content-disposition");
  const match = disposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (match) return match[1].replace(/^['"]|['"]$/g, "");
  return fallback || path.basename(new URL(url).pathname);
}

/**
 * Upload a file from URL to Google Drive
 */
async function uploadFromUrlToDrive(
  url: string,
  fallbackFilename: string,
  accessToken: string,
  refreshToken: string,
  onProgress?: (percent: number) => void
) {
  const googleClient = new GoogleAuthService(accessToken, refreshToken);

  // Ensure valid access token
  if (!(await googleClient.checkAccessToken())) {
    await googleClient.getAccessToken();
  }

  const drive = googleClient.getDriveClient();
  const folderName = process.env.GDRIVE_UPLOAD_FOLDER_NAME;
  if (!folderName) throw new Error("GDRIVE_UPLOAD_FOLDER_NAME is not defined");

  const folderId = await getOrCreateFolder(drive, folderName);

  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch file from URL: ${res.statusText}`);
  }

  const filename = extractFilename(res, url, fallbackFilename);
  const contentLength = parseInt(res.headers.get("content-length") || "1", 10);
  const mimeType =
    res.headers.get("content-type") || "application/octet-stream";

  const pass = new stream.PassThrough();
  let downloaded = 0;
  let lastProgress = 0;

  res.body.on("data", (chunk) => {
    downloaded += chunk.length;
    const percent = Math.floor((downloaded / contentLength) * 100);
    if (percent >= lastProgress + 2 || percent === 100) {
      lastProgress = percent;
      onProgress?.(percent);
    }
  });

  res.body.pipe(pass);

  const uploadRes = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: pass,
    },
  });

  return {
    fileId: uploadRes.data.id,
    filename,
    folderId,
  };
}

/**
 * Get total and used storage of Google Drive
 */
async function getDriveStorageQuota(
  accessToken: string,
  refreshToken: string
): Promise<{
  limit: number;
  usage: number;
  usageInDrive: number;
  usageInDriveTrash: number;
  free: number;
}> {
  const googleClient = new GoogleAuthService(accessToken, refreshToken);

  if (!(await googleClient.checkAccessToken())) {
    await googleClient.getAccessToken();
  }

  const drive = googleClient.getDriveClient();

  const res = await drive.about.get({
    fields: "storageQuota",
  });

  const quota = res.data.storageQuota;
  if (!quota || !quota.limit || !quota.usage || !quota.usageInDrive) {
    throw new Error("Failed to retrieve Drive quota");
  }

  const limit = parseInt(quota.limit);
  const usage = parseInt(quota.usage);
  const usageInDrive = parseInt(quota.usageInDrive);
  const usageInDriveTrash = parseInt(quota.usageInDriveTrash || "0");

  const free = limit - usage;

  return {
    limit,
    usage,
    usageInDrive,
    usageInDriveTrash,
    free,
  };
}

export { uploadFromUrlToDrive, getDriveStorageQuota };
