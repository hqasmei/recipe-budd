export type Recipe = {
  id?: number;
  image: string;
  recipeName: string;
  time: string;
  ingredients: Array<{ detail: string }>;
  instructions: Array<{ step: string }>;
  slug: string;
};
