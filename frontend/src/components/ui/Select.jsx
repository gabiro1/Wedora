"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Select = forwardRef(({ label, error, className, children, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
    )}
    <select
      ref={ref}
      className={cn(
        "w-full h-10 px-3 rounded-md border border-border bg-white text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold",
        "transition-colors duration-200 appearance-none",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B6560%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat pr-10",
        error && "border-destructive",
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
));

Select.displayName = "Select";
export default Select;
