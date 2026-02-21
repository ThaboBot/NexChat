"use client";

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MarketplaceListing, MarketplaceRequest } from '@/lib/types';

const listings: MarketplaceListing[] = [
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
  {
    id: 'lst-2',
    title: 'Ergonomic Standing Desk (Bamboo)',
    category: 'Furniture',
    price: 420,
    condition: 'Excellent',
    location: 'Dallas, TX',
    trustScore: 93,
    shipping: ['Delivery', 'Pickup'],
    tags: ['Bundle Ready', 'Office'],
  },
  {
    id: 'lst-3',
    title: 'Road Bike Carbon 54cm',
    category: 'Sports',
    price: 1120,
    condition: 'Good',
    location: 'Houston, TX',
    trustScore: 89,
    shipping: ['Pickup'],
    tags: ['Negotiable', 'Certified'],
  },
];

const buyerRequests: MarketplaceRequest[] = [
  {
    id: 'req-1',
    title: 'Need a remote-work setup under $1,500',
    budget: 1500,
    preferredCategories: ['Electronics', 'Furniture'],
    urgency: 'High',
  },
  {
    id: 'req-2',
    title: 'Looking for a starter content creator kit',
    budget: 1200,
    preferredCategories: ['Electronics'],
    urgency: 'Medium',
  },
];

const categories = ['All', 'Electronics', 'Furniture', 'Sports'];

export function MarketplaceHub() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesQuery = listing.title.toLowerCase().includes(query.toLowerCase()) || listing.tags.join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || listing.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  return (
    <section className="grid min-h-0 flex-1 gap-4 overflow-auto p-4 md:grid-cols-[2fr_1fr] md:p-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Marketplace Discovery</CardTitle>
            <CardDescription>Flexible matching with trust scoring, request-driven selling, and dynamic bundles.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row">
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
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredListings.map(listing => (
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
          ))}
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

        <Card>
          <CardHeader>
            <CardTitle>Why this is beyond Marketplace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Buyer request board enables reverse listings.</p>
            <p>• Trust scoring and delivery flexibility increase conversion confidence.</p>
            <p>• Smart negotiation entry point keeps chat + commerce in one workflow.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
