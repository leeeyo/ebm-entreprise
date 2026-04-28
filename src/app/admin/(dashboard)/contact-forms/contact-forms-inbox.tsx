"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, ExternalLink, Search } from "lucide-react";
import { ContactEmailAction } from "@/components/admin/contact-email-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ContactSubmissionRecord } from "@/lib/cms-content";

const STATUS_LABELS: Record<ContactSubmissionRecord["status"], string> = {
  new: "Nouveau",
  read: "Lu",
  callback: "À rappeler",
  assigned: "Assigné",
  closed: "Clôturé",
};

function formatDate(value?: string) {
  if (!value) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-TN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function csvCell(value: string | undefined) {
  return `"${(value ?? "").replace(/"/g, '""')}"`;
}

function downloadCsv(rows: ContactSubmissionRecord[]) {
  const header = [
    "Date",
    "Nom",
    "Email",
    "Téléphone",
    "Service",
    "Sujet",
    "Statut",
    "Assigné à",
    "Message",
    "Notes internes",
  ];
  const csvRows = rows.map((row) =>
    [
      formatDate(row.createdAt),
      row.name,
      row.email,
      row.phone,
      row.serviceInterest ?? row.sourcePage,
      row.subject,
      STATUS_LABELS[row.status],
      row.assignedTo,
      row.message,
      row.internalNotes,
    ]
      .map(csvCell)
      .join(","),
  );
  const blob = new Blob([[header.map(csvCell).join(","), ...csvRows].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `demandes-contact-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ContactFormsInbox({ messages }: { messages: ContactSubmissionRecord[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return messages;
    return messages.filter((message) =>
      [
        message.name,
        message.email,
        message.phone,
        message.subject,
        message.serviceInterest,
        message.assignedTo,
        STATUS_LABELS[message.status],
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    );
  }, [messages, query]);

  const selectedRows = messages.filter((message) => selectedIds.has(message.id));
  const allVisibleSelected =
    filteredMessages.length > 0 && filteredMessages.every((message) => selectedIds.has(message.id));

  function toggleOne(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allVisibleSelected) {
        filteredMessages.forEach((message) => next.delete(message.id));
      } else {
        filteredMessages.forEach((message) => next.add(message.id));
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Rechercher nom, email, sujet, assignation..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={selectedRows.length === 0}
            onClick={() => downloadCsv(selectedRows)}
          >
            <Download className="size-4" />
            Exporter la sélection ({selectedRows.length})
          </Button>
          <Button type="button" variant="outline" disabled={selectedIds.size === 0} onClick={() => setSelectedIds(new Set())}>
            Effacer
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleVisible}
                  aria-label="Sélectionner les demandes visibles"
                />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Assigné à</TableHead>
              <TableHead>Reçu le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(message.id)}
                    onChange={() => toggleOne(message.id)}
                    aria-label={`Sélectionner ${message.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{message.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{message.email}</div>
                </TableCell>
                <TableCell>{message.serviceInterest ?? message.sourcePage}</TableCell>
                <TableCell className="max-w-72">
                  <div className="truncate font-medium">{message.subject}</div>
                  <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{message.message}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{STATUS_LABELS[message.status]}</Badge>
                </TableCell>
                <TableCell>{message.assignedTo || <span className="text-muted-foreground">Non assigné</span>}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(message.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ContactEmailAction
                      email={message.email}
                      subject={message.subject}
                      label="Email"
                      size="sm"
                      variant="outline"
                    />
                    <Button type="button" size="sm" asChild>
                      <Link href={`/admin/contact-forms/${message.id}`}>
                        Ouvrir
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  Aucune demande ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
