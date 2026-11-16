import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  if (await getSession()) redirect("/");
  return (
    <div className="login-wrap">
      <div className="login-brand"><span className="dot" /> NetFault</div>
      <p className="muted">Create an account to report network faults</p>
      <RegisterForm />
    </div>
  );
}
