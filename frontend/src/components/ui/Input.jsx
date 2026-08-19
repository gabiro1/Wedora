"use client";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(({ label, error, className, type, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={isPassword && visible ? "text" : type}
          className={cn(
            "w-full h-10 px-3 rounded-md border border-border bg-white text-foreground",
            "placeholder:text-light-gray",
            "focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold",
            "transition-colors duration-200",
            isPassword && "pr-10",
            error && "border-destructive focus:ring-destructive/30",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-warm-gray hover:text-foreground transition-colors"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
