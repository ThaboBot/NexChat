"use client";

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchMarketplaceListings, fetchMarketplaceRequests } from '@/lib/marketplace-api';
import type { MarketplaceListing, MarketplaceRequest } from '@/lib/types';

const fallbackListings: MarketplaceListing[] = [
  {
    id: 'lst-1',
    title: 'DJI Mini 4 Pro + Creator Pack',
    category: 'Electronics',
    price: 850,
    condition: 'Like New',
    location: 'Austin, TX',
    trustScore: 98,
    shipping: ['Pickup', 'Same-Day Courier'],
    tags: ['Verified Seller', 'Warranty'],
  },
];

const fallbackBuyerRequests: MarketplaceRequest[] = [
  {
    id: 'req-1',
    title: 'Need a remote-work setup under $1,500',
    budget: 1500,
    preferredCategories: ['Electronics', 'Furniture'],
    urgency: 'High',
  },
];

const categories = ['All', 'Electronics', 'Furniture', 'Sports'];

export function MarketplaceHub() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [listings, setListings] = useState<MarketplaceListing[]>(fallbackListings);
  const [buyerRequests, setBuyerRequests] = useState<MarketplaceRequest[]>(fallbackBuyerRequests);
  const [apiWarning, setApiWarning] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const nextRequests = await fetchMarketplaceRequests();
        setBuyerRequests(nextRequests);
      } catch (_error) {
        setApiWarning('Python API unavailable. Showing fallback data. Start backend on :8000.');
      }
    };

    loadRequests();
  }, []);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const nextListings = await fetchMarketplaceListings(query, category);
        setListings(nextListings);
      } catch (_error) {
        setApiWarning('Python API unavailable. Showing fallback data. Start backend on :8000.');
      }
    };

    const timer = setTimeout(() => {
      loadListings();
    }, 200);

    return () => clearTimeout(timer);
  }, [category, query]);

  const hasResults = useMemo(() => listings.length > 0, [listings]);

  return (
    <section className="grid min-h-0 flex-1 gap-4 overflow-auto p-4 md:grid-cols-[2fr_1fr] md:p-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Marketplace Discovery</CardTitle>
            <CardDescription>Python-powered matching with trust scoring, request-driven selling, and dynamic bundles.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products, tags, and use-cases..." />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(item => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
          {apiWarning ? <CardContent className="pt-0 text-xs text-amber-500">{apiWarning}</CardContent> : null}
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {hasResults ? (
            listings.map(listing => (
              <Card key={listing.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <Badge variant="secondary">Trust {listing.trustScore}</Badge>
                  </div>
                  <CardDescription>
                    {listing.location} · {listing.condition}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-2xl font-bold">${listing.price.toLocaleString()}</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Delivery: {listing.shipping.join(', ')}</p>
                  <Button className="w-full">Start Smart Negotiation</Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">No listings found. Try changing your search or category.</CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Demand Feed</CardTitle>
            <CardDescription>Post what you need and auto-match sellers in minutes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {buyerRequests.map(request => (
              <div key={request.id} className="rounded-md border p-3">
                <p className="font-medium">{request.title}</p>
                <p className="text-sm text-muted-foreground">Budget up to ${request.budget.toLocaleString()}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {request.preferredCategories.map(item => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                  <Badge>{request.urgency} Priority</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
