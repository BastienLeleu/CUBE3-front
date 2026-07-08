export enum ProductCondition {
  NEW = 'NEW',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  USED = 'USED',
}

export const ProductConditionLabels: Record<ProductCondition, string> = {
  [ProductCondition.NEW]: 'Neuf',
  [ProductCondition.VERY_GOOD]: 'Très bon état',
  [ProductCondition.GOOD]: 'Bon état',
  [ProductCondition.USED]: 'Usagé',
};

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
