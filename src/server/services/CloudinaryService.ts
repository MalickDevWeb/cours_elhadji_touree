import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryService {
  private isConfigured = false;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey || undefined,
        api_secret: apiSecret || undefined,
        secure: true,
      });
      this.isConfigured = true;
    }
  }

  public getStatus() {
    return {
      configured: this.isConfigured,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
      preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default',
    };
  }

  public async uploadImage(imageInput: string, folder = 'students'): Promise<{ url: string; isCloudinary: boolean }> {
    if (!imageInput) return { url: '', isCloudinary: false };

    if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
      return { url: imageInput, isCloudinary: imageInput.includes('cloudinary.com') };
    }

    if (!this.isConfigured) {
      return { url: imageInput, isCloudinary: false };
    }

    const preset = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    const folderPath = `soutien_scolaire/${folder}`;

    try {
      const res = await cloudinary.uploader.unsigned_upload(imageInput, preset, {
        folder: folderPath,
        resource_type: 'auto',
      });
      return { url: res.secure_url, isCloudinary: true };
    } catch (errPreset: any) {
      try {
        const res = await cloudinary.uploader.upload(imageInput, {
          folder: folderPath,
          resource_type: 'auto',
        });
        return { url: res.secure_url, isCloudinary: true };
      } catch (errSigned: any) {
        console.warn('[CloudinaryService] Using base64 fallback:', errSigned?.message || errPreset?.message);
        return { url: imageInput, isCloudinary: false };
      }
    }
  }
}

export const cloudinaryService = new CloudinaryService();
