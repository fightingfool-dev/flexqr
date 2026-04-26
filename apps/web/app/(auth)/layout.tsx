import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 gap-6">
      {/* Brand mark above the card */}
      <Link href="/" className="font-bold text-2xl tracking-tight">
        <span className="text-foreground">Analog</span>
        <span className="text-primary">QR</span>
      </Link>

      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
