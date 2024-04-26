"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { MultiDialog } from "@/components/multi-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { env } from "@/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getToken } from "../../actions/cookies";
import { filesSchema } from "../../data/files/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const formSchema = z.object({
  file_id: z.string(),
  master_file_id: z.string(),
  query_column: z.string(),
  master_column: z.string(),
});
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  url: string;
  file_id: string;
}

async function getFiles(file_type) {
  const token = await getToken();
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files/" + file_type, {
      params: { limit: 100 },
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return filesSchema.parse(data);
}

async function getColumns(file_id) {
  const token = await getToken();
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files/" + file_id + "/columns", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return data.columns;
}

export function DataTableRowActions<TData>({
  row,
  url,
  file_id,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  type Modals = "map";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = await getToken();
    var body = new FormData();

    body.append("file_id", values.file_id);
    body.append("master_file_id", values.master_file_id);
    body.append("query_column", values.query_column);
    body.append("master_column", values.master_column);

    const data = await axios
      .post(env.NEXT_PUBLIC_API + "/files/" + file_id + "/map", body, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => toast(response?.data?.detail ?? "Successfully"))
      .catch((error) => {
        toast(error);
      });
  }

  const [queryFiles, setQueryFiles] = useState([]);
  const [masterFiles, setMasterFiles] = useState([]);

  const [queryColumns, setQueryColumns] = useState([]);
  const [masterColumns, setMasterColumns] = useState([]);

  const [selectedQuery, selectQuery] = useState("");
  const [selectedMaster, selectMaster] = useState("");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchFiles() {
      const data_query = await getFiles("query");
      const data_master = await getFiles("master");
      setQueryFiles(data_query.files);
      setMasterFiles(data_master.files);
    }

    if (open == true) {
      fetchFiles();
    }
  }, [open]);

  useEffect(() => {
    async function fetchColumns() {
      const columns = await getColumns(selectedQuery);
      setQueryColumns(columns);
    }
    if (open == true) {
      fetchColumns();
    }
  }, [selectedQuery]);

  useEffect(() => {
    async function fetchColumns() {
      const columns = await getColumns(selectedMaster);
      setMasterColumns(columns);
    }
    if (open == true) {
      fetchColumns();
    }
  }, [selectedMaster]);

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
              {row.getValue("type") == "QUERY" && (
                <>
                  <mdb.Trigger value="map">
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                      Map Data
                    </DropdownMenuItem>
                  </mdb.Trigger>

                  <DropdownMenuSeparator />
                </>
              )}
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
                  const token = await getToken();
                  await axios
                    .delete(env.NEXT_PUBLIC_API + "/files/" + file_id, {
                      headers: {
                        Authorization: "Bearer " + token,
                      },
                    })
                    .then((response) => toast("Deleted file successfully"))
                    .catch((error) => {
                      toast(error);
                    });

                  router.refresh();
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <mdb.Container value="map">
            <Dialog>
              <DialogPortal>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Map Data</DialogTitle>
                    <DialogDescription>
                      {
                        "Mapping this data may take a considerable amount of time due to its size and complexity."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="mb-5">
                        <FormField
                          control={form.control}
                          name="file_id"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                              <FormLabel className="text-right">
                                Query File
                              </FormLabel>
                              <div className="col-span-3">
                                <Select
                                  onValueChange={(value) => {
                                    selectQuery(value);
                                    field.onChange(value);
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="col-span-3 w-full">
                                      <SelectValue placeholder="Select query file" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="col-span-3 max-h-52">
                                    {queryFiles.map((queryFile) => (
                                      <SelectItem value={queryFile.id}>
                                        {queryFile.file_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="master_file_id"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                              <FormLabel className="text-right">
                                Master File
                              </FormLabel>
                              <div className="col-span-3">
                                <Select
                                  onValueChange={(value) => {
                                    selectMaster(value);
                                    field.onChange(value);
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="col-span-3 w-full">
                                      <SelectValue placeholder="Select master file" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="col-span-3 max-h-52">
                                    {masterFiles.map((masterFile) => (
                                      <SelectItem value={masterFile.id}>
                                        {masterFile.file_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="query_column"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                              <FormLabel className="text-right">
                                Query Column
                              </FormLabel>
                              <div className="col-span-3">
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="col-span-3 w-full">
                                      <SelectValue placeholder="Select query column" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="col-span-3">
                                    {queryColumns.map((queryColumn) => (
                                      <SelectItem
                                        value={queryColumn.toString()}
                                      >
                                        {queryColumn.toString()}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="master_column"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                              <FormLabel className="text-right">
                                Master Column
                              </FormLabel>
                              <div className="col-span-3">
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="col-span-3 w-full">
                                      <SelectValue placeholder="Select master column" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="col-span-3">
                                    {masterColumns.map((masterColumn) => (
                                      <SelectItem
                                        value={masterColumn.toString()}
                                      >
                                        {masterColumn.toString()}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose>
                          <Button type="submit">Map</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </mdb.Container>
        </>
      )}
    </MultiDialog>
  );
}
