"use client";

import axios from "axios";
import { z } from "zod";
import { columns } from "../../components/file-table/columns";
import { FileTable } from "../../components/file-table/data-table";
import OverallState from "../../components/visualize/overallstate";
import { fileSchema } from "../../data/files/schema";
import { env } from "../../env";

async function getFiles() {
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files/query")
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return z.array(fileSchema).parse(data.files);
}

export default async function dataquality() {
  const files = await getFiles();
  return (
    <div className="m-14">
      <h1 className="mb-11 text-2xl font-bold">Overall Data Quality</h1>
      <OverallState />
      <FileTable data={files} columns={columns} front={true} />
    </div>
  );
}
