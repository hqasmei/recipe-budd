import { FeaturesSection } from './_components/features';
import { HeroSection } from './_components/hero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'RecipeBudd is a recipe management tool that allows you to capture, cook, and create delicious meals.',
};
export default function Home() {
  return (
    <div className="flex flex-col pb-20">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
