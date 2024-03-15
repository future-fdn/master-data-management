"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels } from "@/data/files/data";
import { File } from "@/data/files/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<File>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        // @ts-expect-error
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "file_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Filename"
        className="pl-2"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] pl-2">{row.getValue("file_name")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.type);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="min-w-[100px] max-w-[500px] truncate font-medium">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "modified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modified date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] items-center">
          {row.getValue<Date>("modified").toDateString()}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "User",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploaded by" />
    ),
    cell: ({ row }) => {
      return <div className="flex items-center">{row.original.name}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        url={row.original.url}
        file_id={row.original.id}
      />
    ),
  },
];
