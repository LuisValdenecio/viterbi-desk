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
import { Gmail, Discord, GDrive, AwsS3, Dropbox } from '@/components/svg-icons'
import { Mail } from "lucide-react"


/*
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
*/
export const statuses = [
  {
    value: "Discord",
    label: "Discord",
    icon: Discord,
  },
  {
    value: "AWS S3",
    label: "AWS S3",
    icon: AwsS3,
  },
  {
    value: "Dropbox",
    label: "Dropbox",
    icon: Dropbox,
  },
  {
    value: "SMTP/IMAP",
    label: "SMTP/IMAP",
    icon: Mail,
  },
  {
    value: "Google Drive",
    label: "Google Drive",
    icon: GDrive,
  },
  {
    value: "Gmail",
    label: "Gmail",
    icon: Gmail
  },
]
/*
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
*/