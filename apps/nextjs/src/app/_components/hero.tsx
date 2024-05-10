import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="flex flex-col-reverse lg:grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
          <div className="mr-auto place-self-center col-span-7">
            <h1 className="flex flex-col space-y-2 max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              <span className="block">Your Recipes,</span>
              <span className="block">Beautifully Organized</span>
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Streamline your cooking adventures with our{' '}
              <strong>easy-to-use</strong>, <strong>free</strong> recipe
              management tool.
            </p>
          </div>

          <div className="mb-8  lg:mt-0 lg:col-span-4  flex">
            <Image
              className="rounded-xl w-full"
              width="800"
              height="800"
              src="/hero-image.png"
              alt="hero image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
