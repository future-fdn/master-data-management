"use client";

import { filesSchema } from "@/data/files/schema";
import { env } from "@/env";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getToken } from "../../actions/cookies";
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
  const token = await getToken();
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return filesSchema.parse(data);
}

async function getStats() {
  const token = await getToken();
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files/stats", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return data;
}

async function getGraphData() {
  const token = await getToken();
  const data = await axios
    .get(env.NEXT_PUBLIC_API + "/files/graph", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return data;
}

export default function dataquality() {
  type FilesState = z.infer<typeof filesSchema>;
  const [files, setFiles] = useState<FilesState>();
  const [stats, setStats] = useState<any>({});
  const [graph, setGraph] = useState<any>({});

  useEffect(() => {
    async function fetchFiles() {
      const data = await getFiles();
      const stats = await getStats();
      const graph = await getGraphData();
      setFiles(data);
      setStats(stats);
      setGraph(graph);
    }

    fetchFiles();
  }, []);

  return (
    <ScrollArea className="h-screen">
      <div className="m-14 space-y-3">
        <h1 className="mb-11 text-2xl font-bold">Overall Data Quality</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CompletenessCard
            percentage={stats?.overall_completeness ?? "0%"}
            diff={stats?.completeness_diff ?? "+0%"}
          />
          <UniquenessCard
            percentage={stats?.overall_uniqueness ?? "0%"}
            diff={stats?.uniqueness_diff ?? "+0%"}
          />
          <QueryRecordsCard
            value={stats?.total_query_records ?? 0}
            diff={stats?.query_records_diff ?? 0}
          />
          <MasterRecordsCard
            value={stats?.total_master_records ?? 0}
            diff={stats?.master_records_diff ?? 0}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[340px] pl-2">
              {graph?.datas && (
                <OverallState
                  data={graph.datas.map((value) => {
                    const date = new Date(value.date);
                    date.setHours(0, 0, 0, 0);
                    return { date: date, value: value.value };
                  })}
                />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Files</CardTitle>
              <CardDescription>
                You uploaded total of {stats?.this_month_query_data ?? 0} files
                this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-full">
                <FileTable
                  data={(files?.files ?? []).filter(
                    (data) => data.type == "QUERY",
                  )}
                  total={files?.total ?? 0}
                  file_type={"QUERY"}
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
      </div>
    </ScrollArea>
  );
}
