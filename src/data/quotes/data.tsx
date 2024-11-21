import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { TruckIcon } from "lucide-react";
import { ComponentType } from "react";

export const statuses: {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    value: "draft",
    label: "Draft",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CrossCircledIcon,
  },
];

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

// Separate statuses for pickup and delivery
export const pickupStatuses = [
  {
    value: "draft",
    label: "Draft",
    icon: QuestionMarkCircledIcon,
  },
  { value: "in progress", label: "In Progress", icon: StopwatchIcon },
  {
    value: "ready for pickup",
    label: "Ready for Pickup",
    icon: CheckCircledIcon,
  },
  { value: "completed", label: "Completed", icon: CheckCircledIcon },
  { value: "cancelled", label: "Cancelled", icon: CrossCircledIcon },
];

export const deliveryStatuses = [
  {
    value: "draft",
    label: "Draft",
    icon: QuestionMarkCircledIcon,
  },
  { value: "in progress", label: "In Progress", icon: StopwatchIcon },
  { value: "ready for shipping", label: "Ready for Shipping", icon: TruckIcon },
  { value: "shipped", label: "Shipped", icon: ArrowRightIcon },
  { value: "completed", label: "Completed", icon: CheckCircledIcon },
  { value: "cancelled", label: "Cancelled", icon: CrossCircledIcon },
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
