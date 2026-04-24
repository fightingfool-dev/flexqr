"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  svgString: string;
  filename: string;
};

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function handleSvg(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  triggerDownload(blob, `${filename}.svg`);
}

function handlePng(svgString: string, filename: string) {
  const SIZE = 1200;

  // Replace fixed width/height so the SVG fills the canvas at any size.
  const sized = svgString
    .replace(/(<svg[^>]*)\swidth="\d+"/, `$1 width="${SIZE}"`)
    .replace(/(<svg[^>]*)\sheight="\d+"/, `$1 height="${SIZE}"`);

  const blob = new Blob([sized], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    URL.revokeObjectURL(url);
    canvas.toBlob((png) => {
      if (png) triggerDownload(png, `${filename}.png`);
    }, "image/png");
  };

  img.src = url;
}

export function QRDownloadButton({ svgString, filename }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="shrink-0">
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handlePng(svgString, filename)}>
          PNG
          <span className="ml-auto pl-4 text-xs text-muted-foreground">
            1200 × 1200
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSvg(svgString, filename)}>
          SVG
          <span className="ml-auto pl-4 text-xs text-muted-foreground">
            Vector
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
