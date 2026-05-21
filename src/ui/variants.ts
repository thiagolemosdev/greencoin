import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export { cva, type VariantProps };

export function cx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function compose(...classLists: (string | undefined | null | false)[]): string {
  return twMerge(...classLists.filter(Boolean) as string[]);
}
