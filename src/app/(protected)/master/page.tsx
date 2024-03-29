"use client";

import { fileSchema } from "@/data/files/schema";
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
  return z.array(fileSchema).parse(data.files);
}

export default function Master() {
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
      <h1 className="mb-11 text-2xl font-bold">Master Files</h1>
      <FileTable data={files} columns={columns} />
    </div>
  );
}
