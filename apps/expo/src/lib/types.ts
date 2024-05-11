export type Recipe = {
  id?: number;
  image?: string;
  recipeName: string;
  ingredients: string[];
  instructions: string[];
  time: string;
  slug: string;
};
