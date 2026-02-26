import type { MarketplaceListing, MarketplaceRequest } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || 'http://localhost:8000';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Marketplace API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchMarketplaceListings(query: string, category: string): Promise<MarketplaceListing[]> {
  const params = new URLSearchParams();
  if (query.trim()) {
    params.set('q', query.trim());
  }
  if (category && category !== 'All') {
    params.set('category', category);
  }
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return fetchJson<MarketplaceListing[]>(`/api/marketplace/listings${suffix}`);
}

export async function fetchMarketplaceRequests(): Promise<MarketplaceRequest[]> {
  return fetchJson<MarketplaceRequest[]>('/api/marketplace/requests');
}
