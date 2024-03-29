"use client";

import { fileSchema } from "@/data/files/schema";
import { env } from "@/env";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import CompletenessCard from "../../components/data-quality/completeness";
import MasterRecordsCard from "../../components/data-quality/master-records";
import QueryRecordsCard from "../../components/data-quality/query-records";
import UniquenessCard from "../../components/data-quality/uniqueness";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { FileTable } from "../../components/ui/file-table";
import { ScrollArea } from "../../components/ui/scroll-area";
import OverallState from "../../components/visualize/overallstate";
import { columns } from "../../data/files/columns";

async function getFiles() {
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files")
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
    <ScrollArea className="h-screen">
      <div className="m-14 space-y-3">
        <h1 className="mb-11 text-2xl font-bold">Overall Data Quality</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CompletenessCard />
          <UniquenessCard />
          <QueryRecordsCard />
          <MasterRecordsCard />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[340px] pl-2">
              <OverallState data={files} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Files</CardTitle>
              <CardDescription>
                You uploaded total of 265 files this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-full">
                <FileTable
                  data={files.filter((data) => data.type == "QUERY")}
                  columns={columns.filter(
                    (data) =>
                      // @ts-expect-error
                      data.accessorKey === "file_name" ||
                      // @ts-expect-error
                      data.accessorKey === "type",
                  )}
                  fullTable={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <OverallState data={files} />
      <FileTable
        data={files.filter((data) => data.type == "QUERY")}
        columns={columns}
      /> */}
      </div>
    </ScrollArea>
  );
}
