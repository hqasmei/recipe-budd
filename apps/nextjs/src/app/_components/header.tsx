 
 
import Link from "next/link";   
import Image from "next/image";

export async function Header() { 
  return (
    <div className="border-b py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <Link href="/" className="flex gap-2 items-center text-xl">
            <Image
              className="rounded w-8 h-8"
              width="50"
              height="50"
              src="/icon.png"
              alt="hero image"
            />
            <span className="font-bold">RecipeBudd</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
