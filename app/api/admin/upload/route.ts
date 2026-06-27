import { NextRequest } from "next/server";
import { withApiHandler, successResponse, errorResponse } from "@/lib/apiResponse";
import { getSignedUploadParams, CLOUDINARY_FOLDERS, CloudinaryFolder } from "@/lib/cloudinary";

/**
 * POST /api/admin/upload
 * Returns Cloudinary signed upload parameters for direct browser upload.
 *
 * Body: { folder: "packages" | "destinations" | "blogs" | ... }
 */
export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { folder } = body;

  let folderPath = "";
  if (folder && folder in CLOUDINARY_FOLDERS) {
    folderPath = CLOUDINARY_FOLDERS[folder as keyof typeof CLOUDINARY_FOLDERS];
  } else {
    const found = Object.values(CLOUDINARY_FOLDERS).find((v) => v === folder);
    if (found) {
      folderPath = found;
    }
  }

  if (!folderPath) {
    return errorResponse(
      `Invalid folder. Must be one of keys: ${Object.keys(CLOUDINARY_FOLDERS).join(", ")} or values: ${Object.values(CLOUDINARY_FOLDERS).join(", ")}`,
      "VALIDATION_ERROR",
      400
    );
  }

  const params = getSignedUploadParams(folderPath as CloudinaryFolder);

  return successResponse(params);
});
