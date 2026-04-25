"use client";

import { Download, FileText, FileJson, Image, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportDropdownProps {
  qrCodeId: string;
  /** Show analytics export options */
  showAnalytics?: boolean;
  /** Show QR image download options */
  showImage?: boolean;
}

export function ExportDropdown({
  qrCodeId,
  showAnalytics = false,
  showImage = true,
}: ExportDropdownProps) {
  function downloadLink(href: string) {
    const a = document.createElement("a");
    a.href = href;
    a.click();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {showImage && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>QR code</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => downloadLink(`/api/qr/${qrCodeId}/export/png`)}
            >
              <Image className="h-4 w-4" />
              Download PNG
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => downloadLink(`/api/qr/${qrCodeId}/export/svg`)}
            >
              <Code className="h-4 w-4" />
              Download SVG
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        {showImage && showAnalytics && <DropdownMenuSeparator />}

        {showAnalytics && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Analytics</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() =>
                downloadLink(
                  `/api/qr/${qrCodeId}/analytics/export/csv`
                )
              }
            >
              <FileText className="h-4 w-4" />
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                downloadLink(
                  `/api/qr/${qrCodeId}/analytics/export/json`
                )
              }
            >
              <FileJson className="h-4 w-4" />
              Export JSON
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
