"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { MultiDialog } from "@/components/multi-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DistanceChart from "../visualize/distancechart";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export const MapSchema = z.object({
  query_file: z.string({
    required_error: "Please select query file.",
  }),
  master_file: z.string({
    required_error: "Please select master file.",
  }),
  query_column: z.string({
    required_error: "Please select query column.",
  }),
  master_column: z.string({
    required_error: "Please select master column.",
  }),
});

export function TaskTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const form = useForm<z.infer<typeof MapSchema>>({
    resolver: zodResolver(MapSchema),
  });

  type Modals = "map" | "download";

  return (
    <MultiDialog<Modals>>
      {(mdb) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <mdb.Trigger value="map">
                <DropdownMenuItem>Map Data</DropdownMenuItem>
              </mdb.Trigger>
              <DropdownMenuSeparator />
              <Link
                href={"#"}
                download={true}
                rel="noopener noreferrer"
                target="_blank"
              >
                <DropdownMenuItem>Download</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          <mdb.Container value="map">
            <Dialog>
              <DialogPortal>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Map Result</DialogTitle>
                    <DialogDescription>
                      {"Result of the data mapping."}
                      <br />
                      {"You can download exported file in tasks page."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-full w-full">
                    <DistanceChart />
                  </div>
                  <DialogFooter>
                    <Button variant="link" className="border-0">
                      <Link href="/tasks">Go to tasks page</Link>
                    </Button>
                    <DialogClose>
                      <Button>Done</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </mdb.Container>
        </>
      )}
    </MultiDialog>
  );
}
