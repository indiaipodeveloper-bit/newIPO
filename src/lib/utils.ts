import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  // If we're in development, get the API URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // If it's already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    // Edge case: if the database has the production URL but we are on localhost,
    // or if the URL already contains the base, just return it.
    if (path.includes('localhost:5000')) {
      return path;
    }
    // For external URLs, return as is
    return path;
  }
  
  // Ensure the path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
}
