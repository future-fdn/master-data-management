"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import axios from "axios";
import { getToken } from "../../actions/cookies";
import { filesSchema } from "../../data/files/schema";
import { env } from "../../env";
import { cn } from "../../lib/utils";
import { DataTablePagination } from "./data-table-pagination";
import { FileTableToolbar } from "./file-table-toolbar";
import { ScrollArea } from "./scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  file_type: string;
  fullTable?: boolean;
}

export async function fetchData(
  options: {
    pageIndex: number;
    pageSize: number;
  },
  fileType,
) {
  const token = await getToken();

  if (fileType == "QUERY") {
    var url = env.NEXT_PUBLIC_API + "/files/query";
  } else if (fileType == "MASTER") {
    var url = env.NEXT_PUBLIC_API + "/files/master";
  } else {
    var url = env.NEXT_PUBLIC_API + "/files";
  }

  const data = await axios
    .get(url, {
      params: {
        offset: options.pageSize * options.pageIndex,
        limit: options.pageSize,
      },
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
  const files = filesSchema.parse(data);

  return {
    rows: files.files,
    pageCount: files.total,
    rowCount: files.files.length,
  };
}

export function FileTable<TData, TValue>({
  columns,
  data,
  total,
  file_type,
  fullTable = true,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [files, setFiles] = React.useState(data);
  const [fileType, setFileType] = React.useState(file_type);

  React.useEffect(() => {
    async function fetchFiles() {
      const data = await fetchData(pagination, fileType);
      setFiles(data.rows as Array<any>);
    }

    fetchFiles();
  }, [pagination]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: files,
    columns,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },

    onPaginationChange: setPagination,
    manualPagination: true, //we're doing manual "server-side" pagination
    rowCount: total,

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      {fullTable && <FileTableToolbar table={table} />}
      <div className="rounded-md border">
        <ScrollArea className={cn(fullTable ? "h-[460px]" : "h-80")}>
          <Table className="relative">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      {fullTable && <DataTablePagination table={table} />}
    </div>
  );
}
