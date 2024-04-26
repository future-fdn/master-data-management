import QualityChart from "@/components/visualize/qualitychart";

interface OverallStateProps {
  data: any[];
}

export default function OverallState({ data }: OverallStateProps) {
  return (
    <div className="mx-10 mb-6 flex">
      <QualityChart graphData={data} />
    </div>
  );
}
