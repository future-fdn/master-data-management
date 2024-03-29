"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/file-row-actions";
import { types } from "@/data/files/data";
import { File } from "@/data/files/schema";

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
      <div className="w-[200px] truncate pl-2">{row.getValue("file_name")}</div>
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
      return (
        <div className="flex space-x-2">
          <span className="min-w-[100px] max-w-[500px] truncate font-medium">
            {row.getValue("description") === " "
              ? "No description"
              : row.getValue("description")}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const file_type = types.find(
        (type) => type.value === row.getValue("type"),
      );

      if (!file_type) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {file_type.icon && (
            <file_type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{file_type.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "modified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modified date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] items-center truncate">
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
