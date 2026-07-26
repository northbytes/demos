import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* The site is served under a sub-path (see next.config.ts basePath). next/link
 * and the router prefix themselves; a raw <img src="/img/x.jpg"> does not. Run
 * every such path through here. Blob/data URLs (uploaded artwork previews) are
 * left alone. */
export function asset(path: string) {
  return path.startsWith("/")
    ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`
    : path
}
