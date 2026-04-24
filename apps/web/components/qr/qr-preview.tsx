import { generateQRSvg } from "@/lib/qr";

type Props = {
  url: string;
  svgString?: string;
  size?: number;
};

// Server component — generates the SVG on the server, no JS shipped.
// Pass svgString to reuse an already-generated SVG and skip the extra call.
export async function QRPreview({ url, svgString, size = 200 }: Props) {
  const svg = svgString ?? (await generateQRSvg(url));
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-lg border bg-white p-2 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
