import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  FileTextIcon,
  IdCardIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "MASTER",
    label: "MASTER",
  },
  {
    value: "QUERY",
    label: "QUERY",
  },
];

export const types = [
  {
    value: "MASTER",
    label: "MASTER",
    icon: IdCardIcon,
  },
  {
    value: "QUERY",
    label: "QUERY",
    icon: FileTextIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
