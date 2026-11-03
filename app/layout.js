import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Campus Network Fault Reporting System" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="brand">
            <span className="dot" /> NetFault <small>Campus Network Fault Reporting</small>
          </div>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/reports">Fault Reports</Link>
            <Link href="/reports/new">Report a Fault</Link>
            <Link href="/devices">Devices</Link>
            <Link href="/technicians">Technicians</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
