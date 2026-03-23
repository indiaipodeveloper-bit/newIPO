export const getImgSrc = (src: any) => {
  if (!src || src === "0" || src === 0 || src === "") return null;
  const s = String(src).trim();
  if (s.toLowerCase() === 'null') return null;
  
  // Absolute URLs and local Vite assets
  if (s.startsWith('http') || s.startsWith('data:') || s.startsWith('/static') || s.startsWith('/src/assets')) {
    return s;
  }
  
  // Correctly prefix with /uploads/ if it's a relative path
  if (s.startsWith('/uploads')) return s;
  if (s.startsWith('uploads/')) return `/${s}`;
  
  // Basic filename
  return `/uploads/${s}`;
};
