import { promises as fs } from "fs";
import path from "path";

import { DataTable } from "@/components/data-table/data-table";
import { taskSchema } from "@/data/schema";
import { z } from "zod";

import { columns } from "@/components/ui/columns";

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/data/tasks.json"),
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function HomePage() {
  const tasks = await getTasks();
  return (
    <div className="m-14">
      <h1 className="mb-11 text-2xl font-bold">My Files</h1>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
}
