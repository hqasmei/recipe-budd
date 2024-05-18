import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'RecipeBudd is a recipe management tool that allows you to capture, cook, and create delicious meals.',
};
export default function Home() {
  return (
    <div className="flex flex-col pb-20 items-center justify-center flex-1">
      <Image
        className="rounded w-36 h-36"
        width="100"
        height="100"
        src="/icon.png"
        alt="hero image"
      />
      <div className='flex flex-col items-center justify-center w-full space-y-2 mx-auto'>
        <span className="text-4xl font-bold">RecipeBudd</span>
        <p className="text-lg text-neutral-500">Coming soon</p>
      </div>
    </div>
  );
}
