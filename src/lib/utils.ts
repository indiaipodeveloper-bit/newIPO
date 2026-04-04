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
  
  // In development, sometimes the proxy needs a direct hit for certain file types like PDFs
  const isDev = import.meta.env.MODE === 'development';
  if (isDev && cleanPath.startsWith('/uploads')) {
    return `http://localhost:5000${cleanPath}`;
  }
  
  return cleanPath;
}

export function formatIndianNumber(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  
  let str = String(value).trim();
  
  // Handle 'rs' suffix requirement: if it ends with 'rs' (case insensitive), prepend ₹ and remove rs
  if (str.toLowerCase().endsWith('rs')) {
    const withoutRs = str.slice(0, -2).trim();
    if (!withoutRs.startsWith('₹')) {
      str = '₹' + withoutRs;
    } else {
      str = withoutRs;
    }
  }

  // Handle 'cr' suffix: ensure there's a space if it's "10cr" -> "10 Cr"
  if (str.toLowerCase().endsWith('cr') && !str.toLowerCase().endsWith(' cr')) {
    str = str.slice(0, -2).trim() + ' Cr';
  }

  // Remove existing commas and currency symbols for comparison
  const cleanStr = str.replace(/[₹$,\s]/g, '');
  
  // Try to extract the numeric part if it's surrounded by text (e.g., "₹ 12345.67 Cr" or "10 to 20")
  // We'll handle cases with "to" or "-" separately to avoid breaking ranges
  if (str.includes(' to ') || str.includes(' - ')) {
    const separator = str.includes(' to ') ? ' to ' : ' - ';
    return str.split(separator).map(s => formatIndianNumber(s.trim())).join(separator);
  }

  const match = str.match(/([₹$]?)\s*([\d,]+\.?\d*)\s*(.*)/);
  
  if (match) {
    const symbol = match[1] || '';
    const numericPart = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    
    const num = parseFloat(numericPart);
    if (!isNaN(num)) {
      const formattedNum = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 4,
        minimumFractionDigits: 0
      }).format(num);
      
      return `${symbol}${symbol ? ' ' : ''}${formattedNum}${suffix ? (suffix.startsWith(' ') ? suffix : ' ' + suffix) : ''}`.trim();
    }
  }
  
  return str;
}
