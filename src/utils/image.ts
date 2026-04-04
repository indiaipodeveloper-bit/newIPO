export const getImgSrc = (src: any) => {
  if (!src || src === "0" || src === 0 || src === "" || src === "null" || src === "undefined") return null;
  const s = String(src).trim();
  if (s.toLowerCase() === 'null') return null;
  
  // Absolute URLs (including Cloudinary)
  if (s.startsWith('http') || s.startsWith('https') || s.startsWith('data:')) {
    return s;
  }

  // Handle local Vite assets or relative paths
  if (s.startsWith('/static') || s.startsWith('/src/assets')) {
    return s;
  }
  
  // Clean path: remove redundant /uploads/ if it's already there
  let cleanPath = s;
  if (cleanPath.startsWith('/uploads')) {
    // Keep as is
  } else if (cleanPath.startsWith('uploads/')) {
    cleanPath = `/${cleanPath}`;
  } else {
    cleanPath = `/uploads/${cleanPath}`;
  }
  
  return cleanPath;
};
