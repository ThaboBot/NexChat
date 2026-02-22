from typing import List, Literal, Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class MarketplaceListing(BaseModel):
    id: str
    title: str
    category: str
    price: float
    condition: str
    location: str
    trustScore: int
    shipping: List[str]
    tags: List[str]


class MarketplaceRequest(BaseModel):
    id: str
    title: str
    budget: float
    preferredCategories: List[str]
    urgency: Literal['Low', 'Medium', 'High']


listings: List[MarketplaceListing] = [
    MarketplaceListing(
        id='lst-1',
        title='DJI Mini 4 Pro + Creator Pack',
        category='Electronics',
        price=850,
        condition='Like New',
        location='Austin, TX',
        trustScore=98,
        shipping=['Pickup', 'Same-Day Courier'],
        tags=['Verified Seller', 'Warranty'],
    ),
    MarketplaceListing(
        id='lst-2',
        title='Ergonomic Standing Desk (Bamboo)',
        category='Furniture',
        price=420,
        condition='Excellent',
        location='Dallas, TX',
        trustScore=93,
        shipping=['Delivery', 'Pickup'],
        tags=['Bundle Ready', 'Office'],
    ),
    MarketplaceListing(
        id='lst-3',
        title='Road Bike Carbon 54cm',
        category='Sports',
        price=1120,
        condition='Good',
        location='Houston, TX',
        trustScore=89,
        shipping=['Pickup'],
        tags=['Negotiable', 'Certified'],
    ),
]

buyer_requests: List[MarketplaceRequest] = [
    MarketplaceRequest(
        id='req-1',
        title='Need a remote-work setup under $1,500',
        budget=1500,
        preferredCategories=['Electronics', 'Furniture'],
        urgency='High',
    ),
    MarketplaceRequest(
        id='req-2',
        title='Looking for a starter content creator kit',
        budget=1200,
        preferredCategories=['Electronics'],
        urgency='Medium',
    ),
]


app = FastAPI(title='NexChat Marketplace API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.get('/api/marketplace/listings', response_model=List[MarketplaceListing])
def get_listings(
    q: Optional[str] = Query(default=None, description='Search title and tags'),
    category: Optional[str] = Query(default=None, description='Filter by category'),
) -> List[MarketplaceListing]:
    results = listings

    if category and category.lower() != 'all':
        results = [listing for listing in results if listing.category.lower() == category.lower()]

    if q:
        query = q.lower().strip()
        results = [
            listing
            for listing in results
            if query in listing.title.lower() or query in ' '.join(listing.tags).lower()
        ]

    return results


@app.get('/api/marketplace/requests', response_model=List[MarketplaceRequest])
def get_requests() -> List[MarketplaceRequest]:
    return buyer_requests
