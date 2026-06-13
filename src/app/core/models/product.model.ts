export enum ProductCondition {
  NEW = 'Neuf',
  VERY_GOOD = 'Très bon état',
  GOOD = 'Bon état',
  USED = 'Usagé',
}

export interface UserBasic {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
  category: string | null;
  image_url: string | null;
  seller: UserBasic;
  created_at: string;
  updated_at: string;
}
