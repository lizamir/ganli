import type { Metadata, Viewport } from "next";
import { Gveret_Levin } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./site.css";
import "./dashboard.css";
import { GanliProvider } from "@/lib/app/store";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

// Heebo is the main typeface for everything (UI, body and headlines).
// It comes from the supplied Heebo.zip, as one variable font file (weights 100 to 900).
const heebo = localFont({
  src: "./fonts/Heebo-VariableFont_wght.ttf",
  variable: "--font-heebo",
  weight: "100 900",
  display: "swap",
});

// The accent: a Hebrew handwriting face. It marks the one word that matters in a headline,
// the big numerals, and the little margin notes. Never used for running text.
const hand = Gveret_Levin({
  variable: "--font-hand",
  subsets: ["hebrew", "latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "גנלי | משחקים. לומדים. ביחד.",
  description: "גנלי — גן ומעון לגיל הרך. קבוצות קטנות, צוות חם ולמידה דרך משחק לגילאי 6 חודשים עד 3 שנים, עם אזור אישי להורים, לצוות ולמנהלת.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf4e8",
};

// Runs before first paint: lets CSS know JS is on (so reveal animations can start hidden)
// and restores the visitor's accessibility choices without a flash.
const BOOT = `(function(){try{var d=document.documentElement;d.classList.add('js');var s=JSON.parse(localStorage.getItem('ganli-a11y')||'{}');if(s.size)d.dataset.size=s.size;if(s.contrast)d.classList.add('a11y-contrast');if(s.motion)d.classList.add('a11y-nomotion');if(s.links)d.classList.add('a11y-links');if(s.spacing)d.classList.add('a11y-spacing')}catch(e){document.documentElement.classList.add('js')}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <nav aria-label="דילוג לתוכן">
          <a className="skip-link" href="#main">
            דילוג לתוכן הראשי
          </a>
        </nav>
        <GanliProvider>
          <SmoothScroll />
          <Cursor />
          {children}
          <AccessibilityToolbar />
        </GanliProvider>
      </body>
    </html>
  );
}
