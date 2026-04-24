import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { isLoggedIn: boolean };

export function LandingNav({ isLoggedIn }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-lg transition-colors duration-150 hover:text-primary">
          FlexQR
        </Link>
        <nav className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
