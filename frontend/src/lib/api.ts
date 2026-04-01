import { APP_CONFIG } from '@/lib/config';

export type LandRecord = {
  _id?: string;
  tokenId: number;
  ulpin: string;
  owner: string;
  ipfsDocumentHash: string;
  area: number;
  location: string;
  registrationDate?: string;
  isActive?: boolean;
  transactionHash?: string;
};

export type LandDetailsResponse = {
  database: LandRecord;
  blockchain: {
    ulpinHash: string;
    ipfsDocumentHash: string;
    area: string;
    location: string;
    registrationDate: string;
    isActive: boolean;
  };
};

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Request failed');
  }

  return data as T;
}

export async function registerLand(payload: {
  owner: string;
  ulpin: string;
  ipfsHash: string;
  area: number;
  location: string;
}) {
  const response = await fetch(`${APP_CONFIG.backendUrl}/api/land/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseJson<{
    success: true;
    message: string;
    data: {
      tokenId: number;
      transactionHash: string;
      land: LandRecord;
    };
  }>(response);
}

export async function getLandsByOwner(owner: string) {
  const response = await fetch(`${APP_CONFIG.backendUrl}/api/land/owner/${owner}`, {
    cache: 'no-store',
  });

  const result = await parseJson<{
    success: true;
    count: number;
    data: LandRecord[];
  }>(response);

  return result.data;
}

export async function getLandByTokenId(tokenId: string | number) {
  const response = await fetch(`${APP_CONFIG.backendUrl}/api/land/token/${tokenId}`, {
    cache: 'no-store',
  });

  const result = await parseJson<{
    success: true;
    data: LandDetailsResponse;
  }>(response);

  return result.data;
}
