import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';

export class CloudinaryService {
  static async uploadImage(
    filePath: string,
    folder = 'fitness-app'
  ) {
    const result =
      await cloudinary.uploader.upload(
        filePath,
        {
          folder,
          resource_type: 'image',
        }
      );

    await fs.unlink(filePath);

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
    };
  }

  static async deleteImage(
    publicId: string
  ) {
    return cloudinary.uploader.destroy(
      publicId
    );
  }
}