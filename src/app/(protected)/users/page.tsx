"use client";

import { userSchema } from "@/data/users/schema";
import { z } from "zod";

import { columns } from "@/components/user-table/columns";
import { FileTable } from "@/components/user-table/data-table";
import { env } from "@/env";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../../../actions/cookies";

async function getFiles() {
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

  return z.array(userSchema).parse(data.users);
}

export default function HomePage() {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const files = await getFiles();
      setFiles(files);
    }
    fetchData();
  }, []);

  return (
    <div className="m-14">
      <h1 className="mb-11 text-2xl font-bold">Users</h1>
      <FileTable data={files} columns={columns} />
    </div>
  );
}
