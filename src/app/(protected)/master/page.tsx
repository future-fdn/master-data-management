"use client";

import { fileSchema } from "@/data/files/schema";
import { z } from "zod";

import { columns } from "@/components/file-table/columns";
import axios from "axios";
import { useEffect, useState } from "react";
import { FileTable } from "../../../components/file-table/data-table";
import { env } from "../../../env";

async function getFiles() {
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files/master")
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
  return z.array(fileSchema).parse(data.files);
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
      <h1 className="mb-11 text-2xl font-bold">Master Files</h1>
      <FileTable data={files} columns={columns} front={false} />
    </div>
  );
}
