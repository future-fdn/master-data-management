import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdCardIcon } from "@radix-ui/react-icons";

interface MasterRecordsCardProps {
  value: number;
  diff: number;
}

export default function MasterRecordsCard({
  value,
  diff,
}: MasterRecordsCardProps) {
  let formatter = Intl.NumberFormat("en", { notation: "compact" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Master Records
        </CardTitle>
        <IdCardIcon />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatter.format(value)}</div>
        <p className="text-xs text-muted-foreground">
          {Math.abs(diff) === diff ? "+" : ""}
          {formatter.format(diff)} from last month
        </p>
      </CardContent>
    </Card>
  );
}
