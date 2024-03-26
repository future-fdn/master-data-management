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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DistanceChart from "@/components/visualize/distancechart";
import { env } from "@/env";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  url: string;
  file_id: string;
}

export function DataTableRowActions<TData>({
  row,
  url,
  file_id,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  type Modals = "map" | "history";

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
              <mdb.Trigger value="history">
                <DropdownMenuItem>History</DropdownMenuItem>
              </mdb.Trigger>
              <mdb.Trigger value="map">
                <DropdownMenuItem>Map Data</DropdownMenuItem>
              </mdb.Trigger>
              <DropdownMenuSeparator />
              <Link
                href={url}
                download={true}
                rel="noopener noreferrer"
                target="_blank"
              >
                <DropdownMenuItem>Download</DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                onClick={async () => {
                  await axios
                    .delete(env.NEXT_PUBLIC_API + "/files/" + file_id)
                    .catch((error) => toast(error));

                  router.refresh();
                }}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
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
                    <Button variant="link">
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
          <mdb.Container value="history">
            <Dialog>
              <DialogPortal>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>File History</DialogTitle>
                    <DialogDescription>
                      {"Version history of the file"}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </mdb.Container>
        </>
      )}
    </MultiDialog>
  );
}
