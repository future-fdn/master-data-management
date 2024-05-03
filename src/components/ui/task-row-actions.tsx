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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getToken } from "../../actions/cookies";
import { env } from "../../env";
import { cn } from "../../lib/utils";
import DistanceChart from "../visualize/distancechart";
import { Input } from "./input";
import { Label } from "./label";
import { ScrollArea } from "./scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  url: string;
  task_id: string;
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

export const formSchema = z.object({
  source: z.string({
    required_error: "Please select query file.",
  }),
  destination: z.string({
    required_error: "Please select master file.",
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

export async function revertVersion(version_id, task_id) {
  const token = await getToken();

  var url = env.NEXT_PUBLIC_API + `/tasks/${task_id}/versions`;

  const data = await axios
    .patch(
      url,
      { version_id: version_id },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    )
    .then((response) => toast(response.data?.detail))
    .catch((error) => {
      toast(error);
    });
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

export async function fetchResultTable(task_id) {
  const token = await getToken();

  var url = env.NEXT_PUBLIC_API + `/tasks/${task_id}/table`;

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
  url,
  task_id,
}: DataTableRowActionsProps<TData>) {
  const form = useForm<z.infer<typeof MapSchema>>({
    resolver: zodResolver(MapSchema),
  });
  const [open, setOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultTableOpen, setResultTableOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [result, setResult] = useState<any>({});
  const [resultTable, setResultTable] = useState<any>([]);
  const [versions, setVersions] = useState<any>([]);

  const formEdit = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
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

  useEffect(() => {
    async function fetchFiles() {
      const data = await fetchResultTable(row.getValue("id"));
      setResultTable(data);
    }

    if (resultTableOpen == true) {
      fetchFiles();
    }
  }, [resultTableOpen]);

  useEffect(() => {
    async function fetchFiles() {
      const data = await fetchResultTable(row.getValue("id"));
      setResultTable(data);
    }

    if (editOpen == true) {
      fetchFiles();
    }
  }, [editOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = await getToken();
    const result = await axios
      .put(
        env.NEXT_PUBLIC_API + "/tasks/" + row.getValue("id"),
        {
          source: values.source,
          destination: values.destination,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
      .then((response) => toast(response.data?.detail))
      .catch((error) => toast(error));
  }

  type Modals = "graph" | "table" | "history" | "edit";

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
              <mdb.Trigger value="graph">
                <DropdownMenuItem onClick={() => setResultOpen(true)}>
                  Graph Result
                </DropdownMenuItem>
              </mdb.Trigger>

              <mdb.Trigger value="table">
                <DropdownMenuItem onClick={() => setResultTableOpen(true)}>
                  Table Result
                </DropdownMenuItem>
              </mdb.Trigger>
              <DropdownMenuSeparator />

              <mdb.Trigger value="edit">
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  Edit
                </DropdownMenuItem>
              </mdb.Trigger>

              <mdb.Trigger value="history">
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  History
                </DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
          <mdb.Container value="graph">
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
                    <DialogClose>
                      <Button>Done</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </mdb.Container>

          <mdb.Container value="edit">
            <Dialog>
              <DialogPortal>
                <DialogContent>
                  <div className="h-full w-full">
                    <Form {...form}>
                      <form onSubmit={formEdit.handleSubmit(onSubmit)}>
                        <DialogHeader>
                          <DialogTitle>Change Mappings</DialogTitle>
                          <DialogDescription>
                            {
                              "Make changes to your mapping results. Click save when you're done."
                            }
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="source" className="text-right">
                              Source Text
                            </Label>
                            <FormField
                              control={formEdit.control}
                              name="source"
                              render={({ field }) => (
                                <FormItem className="col-span-3">
                                  <FormControl>
                                    <Input
                                      id="source"
                                      placeholder="Source Text"
                                      type="text"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Label htmlFor="source" className="text-right">
                              Destination Text
                            </Label>
                            <FormField
                              control={formEdit.control}
                              name="destination"
                              render={({ field }) => (
                                <FormItem className="col-span-3">
                                  <FormControl>
                                    <Input
                                      id="destination"
                                      placeholder="Destination Text"
                                      type="text"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button type="submit">Save</Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </mdb.Container>

          <mdb.Container value="table">
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
                    <ScrollArea className="w-100 h-64">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Source</TableHead>
                            <TableHead className="w-[100px]">
                              Destination
                            </TableHead>
                            <TableHead className="w-2">Partial</TableHead>
                            <TableHead className="w-2">Full</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {resultTable.map((tableResult: any) => (
                            <TableRow className="font-thai">
                              <TableCell className="font-medium">
                                {tableResult.source}
                              </TableCell>
                              <TableCell className="font-medium">
                                {tableResult.destination}
                              </TableCell>
                              <TableCell>{tableResult.partial}</TableCell>
                              <TableCell>{tableResult.full}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                  <DialogFooter>
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
                              onClick={async () =>
                                await revertVersion(
                                  version.id,
                                  row.getValue("id"),
                                )
                              }
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
