import config from '@/config.json';

// Note: Cloudinary SDK is only used server-side. Client-side uses fetch API.

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (
  file: File | Blob,
  folder: string = 'products'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.cloudinary.uploadPreset);
    formData.append('folder', folder);

    fetch(`https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve({
            public_id: data.public_id,
            secure_url: data.secure_url,
            width: data.width,
            height: data.height,
          });
        }
      })
      .catch((error) => reject(error));
  });
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch(
      `/api/cloudinary/delete?publicId=${encodeURIComponent(publicId)}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Transform image URL (resize, crop, etc.)
 */
export const getTransformedImageUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
  }
): string => {
  const baseUrl = `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload`;
  const transformParams = transformations
    ? Object.entries(transformations)
        .map(([key, value]) => `${key}_${value}`)
        .join(',')
    : '';
  
  return `${baseUrl}/${transformParams}/${publicId}`;
};
