"use client";

import { columns } from "@/components/file-table/columns";
import { FileTable } from "@/components/file-table/data-table";
import OverallState from "@/components/visualize/overallstate";
import { fileSchema } from "@/data/files/schema";
import { env } from "@/env";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

async function getFiles() {
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files/query")
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return z.array(fileSchema).parse(data.files);
}

export default function dataquality() {
  type FileState = z.infer<typeof fileSchema>;
  const [files, setFiles] = useState<FileState[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      const data = await getFiles();
      setFiles(data);
    }

    fetchFiles();
  }, []);

  return (
    <div className="m-14">
      <h1 className="mb-11 text-2xl font-bold">Overall Data Quality</h1>
      <OverallState />
      <FileTable data={files} columns={columns} front={true} />
    </div>
  );
}
