import QualityChart from "@/components/visualize/qualitychart";
import QualityStat from "@/components/visualize/qualitystat";

export default function OverallState() {
  return (
    <div className="mb-6 flex">
      <div className="mb-10 ml-5 mr-10">
        <QualityChart />
      </div>
      <div>
        <QualityStat />
      </div>
    </div>
  );
}
