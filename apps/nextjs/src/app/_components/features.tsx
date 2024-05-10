export function FeaturesSection() {
  return (
    <section
      id="features"
      className="container mx-auto py-24 bg-[#BBCEA7]/20 dark:bg-background rounded-xl"
    >
      <p className="text-4xl text-center mb-12">
        Everything You Need to Master Your Recipes
      </p>

      <ul className="max-w-6xl mx-auto gap-2 list-disc grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-12 leading-10">
        <li>Add and Edit Recipes</li>
        <li>Automatic Ingredient Scaling</li>
        <li>Recipe Sharing Capabilities</li>
        <li>Image Uploads for Recipes</li>
        <li>Customizable Recipe Categories</li>
        <li>Recipe Rating and Reviews</li>
        <li>Advanced Search Filters</li>
        <li>Favorite Recipe Bookmarking</li>
      </ul>
    </section>
  );
}
