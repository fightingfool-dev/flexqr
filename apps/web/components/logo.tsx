import Link from "next/link";
import { cn } from "@/lib/utils";

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top-left finder */}
      <rect x="0" y="0" width="13" height="13" rx="2.5" fill="#4F46E5" />
      <rect x="2.5" y="2.5" width="8" height="8" rx="1.5" fill="white" />
      <rect x="4.5" y="4.5" width="4" height="4" rx="1" fill="#4F46E5" />

      {/* Top-right finder */}
      <rect x="19" y="0" width="13" height="13" rx="2.5" fill="#4F46E5" />
      <rect x="21.5" y="2.5" width="8" height="8" rx="1.5" fill="white" />
      <rect x="23.5" y="4.5" width="4" height="4" rx="1" fill="#4F46E5" />

      {/* Bottom-left finder */}
      <rect x="0" y="19" width="13" height="13" rx="2.5" fill="#4F46E5" />
      <rect x="2.5" y="21.5" width="8" height="8" rx="1.5" fill="white" />
      <rect x="4.5" y="23.5" width="4" height="4" rx="1" fill="#4F46E5" />

      {/* Data modules — bottom-right area */}
      <rect x="19" y="19" width="5" height="5" rx="1" fill="#4F46E5" />
      <rect x="26" y="19" width="5" height="5" rx="1" fill="#4F46E5" />
      <rect x="19" y="26" width="5" height="5" rx="1" fill="#4F46E5" />
      <rect x="26" y="26" width="5" height="5" rx="1" fill="#4F46E5" opacity="0.35" />

      {/* Center timing dot */}
      <rect x="14.5" y="14.5" width="3" height="3" rx="0.5" fill="#4F46E5" opacity="0.5" />
    </svg>
  );
}

type LogoSize = "sm" | "md" | "lg";

const sizeMap: Record<LogoSize, { icon: number; text: string; gap: string }> = {
  sm: { icon: 22, text: "text-base", gap: "gap-1.5" },
  md: { icon: 26, text: "text-lg", gap: "gap-2" },
  lg: { icon: 34, text: "text-2xl", gap: "gap-2.5" },
};

type Props = {
  size?: LogoSize;
  showText?: boolean;
  href?: string | null;
  className?: string;
};

export function Logo({ size = "md", showText = true, href = "/", className }: Props) {
  const { icon, text, gap } = sizeMap[size];

  const inner = (
    <span
      className={cn(
        "inline-flex items-center font-bold tracking-tight",
        gap,
        text,
        className
      )}
    >
      <LogoMark size={icon} />
      {showText && (
        <span>
          <span className="text-foreground">Analog</span>
          <span className="text-primary">QR</span>
        </span>
      )}
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="AnalogQR home">
      {inner}
    </Link>
  );
}
