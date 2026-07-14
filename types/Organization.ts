export interface Organization {
  _id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'team';
}
