"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input as InputPrimitive } from "@base-ui/react/input"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <InputPrimitive
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-[#f4574a]/60 focus:ring-4 focus:ring-[#f4574a]/12 aria-invalid:border-rose-500 aria-invalid:ring-4 aria-invalid:ring-rose-500/10",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
