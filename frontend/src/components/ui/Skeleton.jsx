import { cn } from "@/lib/utils";

export default function Skeleton({ className, ...props }) {
  return <div className={cn("skeleton rounded-md", className)} {...props} />;
}
