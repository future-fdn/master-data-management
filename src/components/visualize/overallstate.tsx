import QualityChart from "@/components/visualize/qualitychart";

import { fileSchema } from "@/data/files/schema";
import { z } from "zod";

type File = z.infer<typeof fileSchema>;

interface OverallStateProps {
  data: File[];
}

export default function OverallState({ data }: OverallStateProps) {
  return (
    <div className="mx-10 mb-6 flex">
      <QualityChart />
    </div>
  );
}
