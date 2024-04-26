"use client";

import { filesSchema } from "@/data/files/schema";
import { z } from "zod";

import { columns } from "@/data/files/columns";
import { env } from "@/env";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../../../actions/cookies";
import { FileTable } from "../../../components/ui/file-table";

async function getFiles() {
  const token = await getToken();
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files/master", {
      headers: { Authorization: "Bearer " + token },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
  return filesSchema.parse(data);
}

export default function Master() {
  type Files = z.infer<typeof filesSchema>;

  const [files, setFiles] = useState<Files>();

  useEffect(() => {
    async function fetchData() {
      const files = await getFiles();
      setFiles(files);
    }
    fetchData();
  }, []);

  return (
    <div className="m-14">
      <h1 className="mb-11 text-2xl font-bold">Master Files</h1>
      <FileTable
        data={files?.files ?? []}
        total={files?.total ?? 0}
        file_type={"MASTER"}
        columns={columns}
      />
    </div>
  );
}
