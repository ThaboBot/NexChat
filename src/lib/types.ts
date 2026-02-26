export type User = {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
};

export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
};

export type Message = {
  id: string;
  sender: User;
  text: string;
  timestamp: number;
  selfDestructTime?: number;
  deliveryTime?: number;
  emotion?: string;
  animation?: string;
  poll?: Poll;
};

export type Chat = {
  id: string;
  users: User[];
  messages: Message[];
  isGroup: boolean;
  name?: string;
};

export type Contact = {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  lastMessage: string;
}

export type MarketplaceListing = {
  id: string;
  title: string;
  category: string;
  price: number;
  condition: string;
  location: string;
  trustScore: number;
  shipping: string[];
  tags: string[];
};

export type MarketplaceRequest = {
  id: string;
  title: string;
  budget: number;
  preferredCategories: string[];
  urgency: 'Low' | 'Medium' | 'High';
};
