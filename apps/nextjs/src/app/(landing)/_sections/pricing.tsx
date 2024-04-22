import { GetStartedButton } from "@/app/_components/get-started-button";
import { SignedIn } from "@/components/auth/signed-in";
import { SignedOut } from "@/components/auth/signed-out";
import { UpgradeButton } from "@/components/stripe/upgrade-button/upgrade-button";
import { CheckIcon } from "lucide-react";

export function PricingSection() {
  return (
    <section className="bg-white dark:bg-gray-900" id="pricing">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-24 lg:px-6">
        <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Perfectly Priced Plans for Your Culinary Needs
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Whether you're just starting out or managing a plethora of recipes,
            our plans are designed to help you succeed.
          </p>
        </div>

        <div className="md:grid flex flex-col  justify-center gap-4 md:grid-cols-2 md:max-w-4xl mx-auto">
          <div className="flex flex-col w-full md:w-fit p-6 text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            <h3 className="mb-4 text-2xl font-semibold">Basic</h3>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
              Get started with essential features at no cost.
            </p>
            <div className="flex items-baseline justify-center my-8">
              <span className="mr-2 text-5xl font-extrabold">FREE</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <CheckIcon className="text-green-400" />
                <span>Add and manage up to 5 recipes</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="text-green-400" />
                <span>Basic recipe sharing</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="text-green-400" />
                <span>Ingredient scaling</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="text-green-400" />
                <span>Mobile and desktop access</span>
              </li>
            </ul>
            <SignedOut>
              <GetStartedButton />
            </SignedOut>
          </div>
          <div className="flex flex-col w-full first-line:md:w-fit p-6 text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            <h3 className="mb-4 text-2xl font-semibold">Premium</h3>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
              Unlock advanced features for the ultimate cooking experience.
            </p>
            <div className="flex items-baseline justify-center my-8">
              <span className="mr-2 text-5xl font-extrabold">$5</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <CheckIcon className="text-green-400" />
                <span>Unlimited recipe additions and management</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="text-green-400" />
                <span>Advanced recipe sharing options</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="text-green-400" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="text-green-400" />
                <span>Recipe image uploads and galleries</span>
              </li>
            </ul>

            <SignedOut>
              <GetStartedButton />
            </SignedOut>

            <SignedIn>
              <UpgradeButton className="w-full" />
            </SignedIn>
          </div>
        </div>
      </div>
    </section>
  );
}
