import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReaderIcon } from "@radix-ui/react-icons";

interface UniquenessCardProps {
  percentage: string;
  diff: string;
}

export default function UniquenessCard({
  percentage,
  diff,
}: UniquenessCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Overall Uniqueness
        </CardTitle>
        <ReaderIcon />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{percentage}</div>
        <p className="text-xs text-muted-foreground">{diff} from last month</p>
      </CardContent>
    </Card>
  );
}
