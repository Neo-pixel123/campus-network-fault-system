import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/");
  return (
    <div className="login-wrap">
      <div className="login-brand"><span className="dot" /> NetFault</div>
      <p className="muted">Campus Network Fault Reporting System</p>
      <LoginForm />
    </div>
  );
}
