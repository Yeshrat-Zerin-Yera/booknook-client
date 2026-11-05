export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  description: string;
  createdBy?: string;
  createdByName?: string;
  createdByEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  copies: number;
}