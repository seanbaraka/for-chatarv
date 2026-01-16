"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function NavHeader() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/75 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl flex items-center gap-1 font-bold text-black dark:text-zinc-50"
        >
          <Image
            src="/chatarv.webp"
            alt="ChatArv"
            width={100}
            height={100}
            className="w-10 h-10"
          />
          <span className="text-xl font-bold text-black dark:text-zinc-50">
            ChatArv
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-950 dark:hover:text-green-300"
          >
            <Link href="https://chatarv.ai">Sign in</Link>
          </Button>
          <Button
            asChild
            className="bg-green-600 rounded-full text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            <Link href="https://chatarv.ai">Get started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
