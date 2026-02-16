/**
 * Product entity and API interfaces
 */
export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  image?: string;
  rating?: { rate: number; count: number };
}

export interface ProductCreateDto {
  title: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
}
