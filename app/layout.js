import "./globals.css";
import Nav from "../components/Nav";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#d9d9d7",
};

export const metadata = {
  title: "Izak Hyllested",
  description: "Portfolio, graphic design and creative development",
  appleWebApp: {
    capable: true,
    title: "Izak Hyllested",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var path = window.location.pathname || "/";
                  if (path !== "/") {
                    document.documentElement.classList.add("site-ready", "intro-complete", "scroll-reveals-ready");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
