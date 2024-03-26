"use client";
import DonutChart from "@/components/visualize/donutchart";
import { env } from "@/env";
import axios from "axios";
import { useEffect, useState } from "react";

export default function QualityStat() {
  const [numberOfRecord, setNumberOfRecord] = useState(0);
  const [numberOfMasterRecord, setNumberOfMasterRecord] = useState(0);
  const [completePercent, setCompletePercent] = useState(0);
  const [uniquenessPercent, setUniquenessPercent] = useState(0);
  const [isBusy, setBusy] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const query = await axios
        .get(env.NEXT_PUBLIC_API + "/files/query")
        .then((res) => res.data);
      const master = await axios
        .get(env.NEXT_PUBLIC_API + "/files/master")
        .then((res) => res.data);

      const queryCount = query.files.reduce(
        (acc: number, cur: any) => acc + cur.valid,
        0,
      );
      const masterCount = master.files.reduce(
        (acc: number, cur: any) => acc + cur.valid,
        0,
      );
      const validPercent =
        query.files.reduce((acc: number, cur: any) => acc + cur.valid, 0) +
        master.files.reduce((acc: number, cur: any) => acc + cur.valid, 0);
      const uniquePercent =
        query.files.reduce((acc: number, cur: any) => acc + cur.unique, 0) +
        master.files.reduce((acc: number, cur: any) => acc + cur.unique, 0);

      setNumberOfRecord(queryCount);
      setNumberOfMasterRecord(masterCount);
      setCompletePercent((validPercent / validPercent) * 100);
      setUniquenessPercent((uniquePercent / validPercent) * 100);
      setBusy(false);
    }

    fetchData();
  }, []);

  return (
    <div className="grid-row-2 grid grid-cols-2 gap-2">
      <div className="flex items-center justify-center rounded-xl border-2 px-5 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h3 className="text-xl font-semibold">Overall Completeness</h3>
        <div>{!isBusy && <DonutChart Number={completePercent} />}</div>
      </div>
      <div className="flex items-center justify-center rounded-xl border-2 px-5 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h3 className="text-xl font-semibold">Overall Uniqueness</h3>
        <div>{!isBusy && <DonutChart Number={uniquenessPercent} />}</div>
      </div>

      <div className="flex items-center justify-center gap-10 rounded-xl border-2 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h3 className="text-xl font-semibold">Query Records</h3>
        <p className="text-2xl font-bold text-blue-500">
          {Intl.NumberFormat("en", { notation: "compact" }).format(
            numberOfRecord,
          )}
        </p>
      </div>
      <div className="flex items-center justify-center gap-10 rounded-xl border-2 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h3 className="text-xl font-semibold ">Master Records</h3>
        <p className="text-2xl font-bold text-blue-500">
          {Intl.NumberFormat("en", { notation: "compact" }).format(
            numberOfMasterRecord,
          )}
        </p>
      </div>
    </div>
  );
}
