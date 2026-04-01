
import { APP_CONFIG } from '@/lib/config';

export const uploadToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${APP_CONFIG.backendUrl}/api/ipfs/upload-file`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to upload file to IPFS');
  }

  return result.data.ipfsHash as string;
};
