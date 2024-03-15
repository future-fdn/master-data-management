import { promises as fs } from "fs";
import path from "path";

import { taskSchema } from "@/data/tasks/schema";
import { z } from "zod";

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/data/tasks/tasks.json"),
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function HomePage() {
  const tasks = await getTasks();
  return (
    <div className="m-14">
      <h1 className="mb-11 text-2xl font-bold">Tasks</h1>
      {/* <DataTable data={tasks} columns={columns} /> */}
    </div>
  );
}
