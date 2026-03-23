import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  const s = String(path).trim();
  
  // If we're in development, use the base URL if needed, but the proxy handles /uploads
  // For absolute URLs, return as is
  if (s.startsWith('http') || s.startsWith('data:') || s.startsWith('/src/assets') || s.startsWith('/static')) {
    return s;
  }
  
  // Normalize path with /uploads/
  let cleanPath = s;
  if (!s.startsWith('/uploads') && !s.startsWith('uploads/')) {
    cleanPath = `/uploads/${s.startsWith('/') ? s.slice(1) : s}`;
  } else if (s.startsWith('uploads/')) {
    cleanPath = `/${s}`;
  }
  
  return cleanPath;
}
