"use client";

import { usersSchema } from "@/data/users/schema";

import { getToken } from "@/actions/cookies";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/data/users/columns";
import { env } from "@/env";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

async function getUsers() {
  const token = await getToken();
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return usersSchema.parse(data);
}

export default function HomePage() {
  type Users = z.infer<typeof usersSchema>;
  const [users, setUsers] = useState<Users>();

  useEffect(() => {
    async function fetchData() {
      const users = await getUsers();
      setUsers(users);
    }
    fetchData();
  }, []);

  return (
    <div className="m-14">
      <h1 className="mb-11 text-2xl font-bold">Users</h1>
      <DataTable
        data={users?.users ?? []}
        total={users?.total}
        columns={columns}
      />
    </div>
  );
}
