"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AdminLoginForm({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Identifiants invalides.");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <Card className={cn("w-full border-black/10 bg-white/95 shadow-2xl shadow-ebm-navy/15 backdrop-blur", className)}>
      <CardHeader className="space-y-3 p-6 sm:p-8">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-ebm-navy text-white shadow-lg shadow-ebm-navy/20">
          <LockKeyhole className="size-5" aria-hidden />
        </div>
        <div>
          <CardTitle className="font-heading text-2xl tracking-tight text-ebm-navy sm:text-3xl">
            Connexion administrateur
          </CardTitle>
          <CardDescription className="mt-2 leading-6">
            Accès réservé à l&apos;équipe EBM.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 pl-9"
                placeholder="admin@ebm-entreprise.tn"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pl-9"
                placeholder="Votre mot de passe"
                required
              />
            </div>
          </div>
          {error ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            Déconnectez-vous après usage sur un poste partagé.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
