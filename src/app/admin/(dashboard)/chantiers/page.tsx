"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminChantiersPage() {
  const [uploading, setUploading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      toast.error("Choisissez un fichier.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as { relativePath?: string };
      toast.success(`Fichier enregistré : ${json.relativePath ?? ""}`);
      form.reset();
    } catch {
      toast.error("Upload impossible.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Chantiers — médias</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Copie 0 : dépôt local dans <code className="rounded bg-muted px-1 py-0.5">uploads/chantiers</code> (voir{" "}
          <code className="rounded bg-muted px-1 py-0.5">UPLOAD_DIR</code>).
        </p>
      </div>
      <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-xl border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="file">Fichier image</Label>
          <Input id="file" name="file" type="file" accept="image/*" />
        </div>
        <Button type="submit" disabled={uploading}>
          {uploading ? "Envoi…" : "Téléverser"}
        </Button>
      </form>
    </div>
  );
}
