"use client";

import { Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Input } from "@/components/ui/input";

import UploadButton from "../upload-button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function FileTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter files..."
          value={
            (table.getColumn("file_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("file_name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
      <UploadButton />
    </div>
  );
}
