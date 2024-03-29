"use client";

import { taskSchema } from "@/data/tasks/schema";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getToken } from "../../../actions/cookies";
import { DataTable } from "../../../components/ui/data-table";
import { columns } from "../../../data/tasks/columns";
import { env } from "../../../env";

async function getTasks() {
  const token = await getToken();
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/tasks", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return z.array(taskSchema).parse(data.tasks);
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const tasks = await getTasks();
      setTasks(tasks);
    }
    fetchData();
  }, []);

  return (
    <div className="m-14">
      <h1 className="mb-11 text-2xl font-bold">Tasks</h1>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
}
