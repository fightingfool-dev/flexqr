import { HeroInteractive } from "@/components/landing/hero-interactive";

type Props = { isLoggedIn: boolean; qrSvg: string };

export function HeroSection({ isLoggedIn, qrSvg }: Props) {
  return <HeroInteractive initialQrSvg={qrSvg} isLoggedIn={isLoggedIn} />;
}
