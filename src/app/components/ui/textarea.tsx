import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-lg border border-gray-300 bg-input-background px-3 py-2 text-base transition-all outline-none focus-visible:ring-[3px] hover:border-border/60 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };