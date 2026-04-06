import { Suspense } from "react";
import { AdminLoginForm } from "@/app/admin/login/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
