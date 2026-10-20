"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** A QR code drawn as inline SVG, in the brand's cocoa color on a transparent background. */
export default function QrCode({ value, label }: { value: string; label: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let live = true;
    QRCode.toString(value, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#3e322b", light: "#0000" } }).then((s) => live && setSvg(s));
    return () => {
      live = false;
    };
  }, [value]);
  return <div className="qr-big" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: svg }} />;
}
