import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

import { BadgeCheck, EyeIcon, KeySquare, ShieldAlert, ShieldCheck, UserRoundX } from "lucide-react"


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
]

export const active_statuses = [
  {
    value: "active",
    label : "Active",
    icon : BadgeCheck
  },
  {
    value: "suspended",
    label : "Suspended",
    icon : ShieldAlert
  },
  {
    value: "removed",
    label : "Removed",
    icon : UserRoundX
  },
]

export const statuses = [
  {
    value: "owner",
    label: "Owner",
    icon: KeySquare,
  },
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheck,
  },
  {
    value: "reader",
    label: "Reader",
    icon: EyeIcon,
  },
]

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
]
