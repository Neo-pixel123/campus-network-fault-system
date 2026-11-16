import "./globals.css";

export const metadata = { title: "Campus Network Fault Reporting System" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
