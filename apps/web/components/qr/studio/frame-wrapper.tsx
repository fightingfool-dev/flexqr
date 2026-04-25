import type { QRDesignSettings, FrameType } from "@/lib/qr-design-types";

type Props = {
  settings: QRDesignSettings;
  children: React.ReactNode;
};

export function QRFrameWrapper({ settings, children }: Props) {
  const { frameType, frameText, frameColor, frameTextColor, bgColor } = settings;

  if (frameType === "none") {
    return (
      <div className="rounded-xl overflow-hidden shadow-sm border">
        {children}
      </div>
    );
  }

  const label = (
    <div
      style={{
        backgroundColor: frameColor,
        color: frameTextColor,
        padding: "6px 12px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      {frameText || "SCAN ME"}
    </div>
  );

  const labelTop = (
    <div
      style={{
        backgroundColor: frameColor,
        color: frameTextColor,
        padding: "6px 12px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      {frameText || "SCAN ME"}
    </div>
  );

  const qrBlock = (
    <div style={{ background: bgColor }}>{children}</div>
  );

  const wrapperBase: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
  };

  switch (frameType as FrameType) {
    case "simple-bottom":
      return (
        <div style={{ ...wrapperBase, border: `2px solid ${frameColor}` }}>
          {qrBlock}
          {label}
        </div>
      );

    case "simple-top":
      return (
        <div style={{ ...wrapperBase, border: `2px solid ${frameColor}` }}>
          {labelTop}
          {qrBlock}
        </div>
      );

    case "rounded-bottom":
      return (
        <div
          style={{
            ...wrapperBase,
            border: `2px solid ${frameColor}`,
            borderRadius: 16,
          }}
        >
          {qrBlock}
          {label}
        </div>
      );

    case "rounded-top":
      return (
        <div
          style={{
            ...wrapperBase,
            border: `2px solid ${frameColor}`,
            borderRadius: 16,
          }}
        >
          {labelTop}
          {qrBlock}
        </div>
      );

    case "banner-bottom":
      return (
        <div style={{ ...wrapperBase }}>
          {qrBlock}
          <div
            style={{
              backgroundColor: frameColor,
              color: frameTextColor,
              padding: "10px 12px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            {frameText || "SCAN ME"}
          </div>
        </div>
      );

    case "banner-top":
      return (
        <div style={{ ...wrapperBase }}>
          <div
            style={{
              backgroundColor: frameColor,
              color: frameTextColor,
              padding: "10px 12px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            {frameText || "SCAN ME"}
          </div>
          {qrBlock}
        </div>
      );

    case "badge":
      return (
        <div
          style={{
            ...wrapperBase,
            border: `2px solid ${frameColor}`,
            borderRadius: 24,
            padding: "8px 8px 0",
            background: bgColor,
          }}
        >
          {children}
          <div
            style={{
              backgroundColor: frameColor,
              color: frameTextColor,
              padding: "5px 12px 7px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textAlign: "center",
              fontFamily: "sans-serif",
              borderRadius: "0 0 20px 20px",
              marginTop: 8,
            }}
          >
            {frameText || "SCAN ME"}
          </div>
        </div>
      );

    case "circle":
      return (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            borderRadius: "50%",
            overflow: "hidden",
            border: `3px solid ${frameColor}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          {children}
        </div>
      );

    case "box":
      return (
        <div
          style={{
            ...wrapperBase,
            border: `3px solid ${frameColor}`,
            padding: 6,
            background: bgColor,
          }}
        >
          {children}
          <div
            style={{
              backgroundColor: frameColor,
              color: frameTextColor,
              padding: "4px 8px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textAlign: "center",
              fontFamily: "sans-serif",
              marginTop: 6,
            }}
          >
            {frameText || "SCAN ME"}
          </div>
        </div>
      );

    case "speech": {
      const triangleSize = 12;
      return (
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ ...wrapperBase, border: `2px solid ${frameColor}`, borderRadius: 12 }}>
            {qrBlock}
            {label}
          </div>
          {/* triangle pointing down */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${triangleSize}px solid transparent`,
              borderRight: `${triangleSize}px solid transparent`,
              borderTop: `${triangleSize}px solid ${frameColor}`,
            }}
          />
        </div>
      );
    }

    case "speech-flipped": {
      const triangleSize = 12;
      return (
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
          {/* triangle pointing up */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${triangleSize}px solid transparent`,
              borderRight: `${triangleSize}px solid transparent`,
              borderBottom: `${triangleSize}px solid ${frameColor}`,
            }}
          />
          <div style={{ ...wrapperBase, border: `2px solid ${frameColor}`, borderRadius: 12 }}>
            {labelTop}
            {qrBlock}
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="rounded-xl overflow-hidden shadow-sm border">
          {children}
        </div>
      );
  }
}
