"use client"

import { CalendarDays, MapPin, User, Building2, Pencil } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useEstimate, useEstimateActions } from "@/lib/estimate-store"
import { formatDate } from "@/lib/format"
import { useState } from "react"
import type { ProjectInfo } from "@/lib/types"

export function ProjectHeader() {
  const { project } = useEstimate()
  const { updateProject } = useEstimateActions()
  const [draft, setDraft] = useState<ProjectInfo>(project)
  const [open, setOpen] = useState(false)

  function handleSave() {
    updateProject(draft)
    setOpen(false)
  }

  return (
    <Card className="border-l-4 border-l-primary py-4">
      <CardContent className="flex flex-col gap-4 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl text-balance">
            {project.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              {project.client}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" />
              {project.estimator}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              <span className="truncate max-w-48">{project.address}</span>
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3" />
              Date: {formatDate(project.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3" />
              Bid Due:{" "}
              <span className="font-semibold text-foreground">
                {formatDate(project.bidDueDate)}
              </span>
            </span>
          </div>
        </div>

        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setDraft(project) }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0">
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Edit Project Info</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="proj-name">Project Name</Label>
                <Input
                  id="proj-name"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft({ ...draft, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="proj-client">Client</Label>
                  <Input
                    id="proj-client"
                    value={draft.client}
                    onChange={(e) =>
                      setDraft({ ...draft, client: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="proj-estimator">Estimator</Label>
                  <Input
                    id="proj-estimator"
                    value={draft.estimator}
                    onChange={(e) =>
                      setDraft({ ...draft, estimator: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="proj-address">Address</Label>
                <Input
                  id="proj-address"
                  value={draft.address}
                  onChange={(e) =>
                    setDraft({ ...draft, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="proj-date">Estimate Date</Label>
                  <Input
                    id="proj-date"
                    type="date"
                    value={draft.date}
                    onChange={(e) =>
                      setDraft({ ...draft, date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="proj-bid">Bid Due Date</Label>
                  <Input
                    id="proj-bid"
                    type="date"
                    value={draft.bidDueDate}
                    onChange={(e) =>
                      setDraft({ ...draft, bidDueDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
