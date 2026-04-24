import { generateQRSvg } from "@/lib/qr";

type Props = {
  url: string;
  size?: number;
};

// Server component — generates the SVG on the server, no JS shipped.
export async function QRPreview({ url, size = 200 }: Props) {
  const svg = await generateQRSvg(url);
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-lg border bg-white p-2 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
