import { ElementProps } from "kiru"

interface ContainerProps extends ElementProps<"div"> {
  mobilePadding?: boolean
  breakpoint?: "sm" | "md"
}

export function Container({
  children,
  className = "",
  mobilePadding = true,
  breakpoint = "sm",
}: ContainerProps) {
  return (
    <div
      className={`${mobilePadding && "px-4"} ${breakpoint === "sm" ? "sm:px-8" : "md:px-8"} max-w-[var(--content-width)] mx-auto ${className}`}
    >
      {children}
    </div>
  )
}
