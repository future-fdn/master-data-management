"use client";

import { DotFilledIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getToken } from "../../actions/cookies";
import { env } from "../../env";
import { cn } from "../../lib/utils";
import DistanceChart from "../visualize/distancechart";
import { ScrollArea } from "./scroll-area";

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

export async function fetchData(task_id) {
  const token = await getToken();

  var url = env.NEXT_PUBLIC_API + `/tasks/${task_id}/versions`;

  const data = await axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return data.versions;
}

export async function fetchResult(task_id) {
  const token = await getToken();

  var url = env.NEXT_PUBLIC_API + `/tasks/${task_id}/data`;

  const data = await axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return data;
}

export function TaskTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const form = useForm<z.infer<typeof MapSchema>>({
    resolver: zodResolver(MapSchema),
  });
  const [open, setOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const [result, setResult] = useState<any>({});
  const [versions, setVersions] = useState<any>([]);

  useEffect(() => {
    async function fetchFiles() {
      const data = await fetchData(row.getValue("id"));
      setVersions(data);
    }

    if (open == true) {
      fetchFiles();
    }
  }, [open]);

  useEffect(() => {
    async function fetchFiles() {
      const data = await fetchResult(row.getValue("id"));
      setResult(data);
    }

    if (resultOpen == true) {
      fetchFiles();
    }
  }, [resultOpen]);

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
              <mdb.Trigger value="map">
                <DropdownMenuItem onClick={() => setResultOpen(true)}>
                  View result
                </DropdownMenuItem>
              </mdb.Trigger>
              <mdb.Trigger value="history">
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  History
                </DropdownMenuItem>
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
                    {result?.links && result?.nodes && (
                      <DistanceChart
                        allLinks={result.links}
                        allNodes={result.nodes}
                      />
                    )}
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

          <mdb.Container value="history">
            <Dialog>
              <DialogPortal>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>File History</DialogTitle>
                    <DialogDescription>
                      Version history of the file
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <ScrollArea className="max-h-72">
                      <div className="my-2">
                        {versions.map((version) => (
                          <div className="grid grid-cols-4 items-start gap-4">
                            <div className="flex items-center justify-center">
                              <div className="after:mx-auto after:block after:h-5 after:w-[1px] after:bg-black">
                                <DotFilledIcon width={25} height={25} />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {version.key.split("/")[1]}
                              </h3>
                              <p className="text-xs font-thin">{version.id}</p>
                            </div>
                            <Button
                              size="sm"
                              className={cn(
                                "col-start-4 w-20",
                                version.latest && "hidden",
                              )}
                              variant="secondary"
                            >
                              Revert
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </mdb.Container>
        </>
      )}
    </MultiDialog>
  );
}
