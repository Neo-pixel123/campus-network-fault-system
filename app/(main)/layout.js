import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

// Every page inside (main) needs a logged-in user
export default async function MainLayout({ children }) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="dot" /> NetFault <small>Campus Network Fault Reporting</small>
        </div>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/reports">Fault Reports</Link>
          <Link href="/reports/new">Report a Fault</Link>
          <Link href="/devices">Devices</Link>
          {isAdmin(user) && <Link href="/technicians">Technicians</Link>}
          <span className="who">{user.name} <em className={isAdmin(user) ? "role admin" : "role"}>{user.role}</em></span>
          <LogoutButton />
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
