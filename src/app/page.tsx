import { Theme } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <Theme>
      <HydrateClient>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-green-600 sm:text-[5rem]">
              <Image
                src="/public/logo.png"
                alt="Unser Logo"
                width={100}
                height={100}
              />
              <span className="text-yellow-200">Trail</span>
              <span className="text-green-800">Tale</span>
            </h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-green-600 p-4 text-white hover:bg-green-500"
                href="/discover"
              >
                <h3 className="text-2xl font-bold">Discover Trails →</h3>
                <div className="text-lg">
                  Find audio guides for popular hiking, jogging, and biking
                  routes near you.
                </div>
              </Link>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-amber-200 p-4 text-green-800 hover:bg-amber-100"
                href="/create"
              >
                <h3 className="text-2xl font-bold">Create Guide →</h3>
                <div className="text-lg">
                  Record and share your own audio tour for your favorite outdoor
                  locations.
                </div>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl text-green-800">
                {hello ? hello.greeting : "Loading your trail guides..."}
              </p>

              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-center text-2xl text-green-600">
                  {session && <span>Welcome back, {session.user?.name}</span>}
                </p>
                <Link
                  href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  className="rounded-full bg-green-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-green-500"
                >
                  <div className="flex items-center gap-2">
                    {session ? (
                      "Sign out"
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 127.14 96.36"
                          fill="currentColor"
                        >
                          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                        </svg>
                        Sign in to access your guides
                      </>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {session?.user && <LatestPost />}
          </div>
        </main>
      </HydrateClient>
    </Theme>
  );
}
