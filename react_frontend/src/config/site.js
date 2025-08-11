 // PUBLIC_INTERFACE
 /**
  * Get the site base URL for building absolute URLs
  * 
  * This function builds a base URL from the environment variable REACT_APP_SITE_URL
  * if provided, otherwise it falls back to the runtime origin (window.location.origin).
  * It also normalizes the URL by removing a trailing slash.
  * 
  * Note: Do not hardcode localhost here; use env var or window.location for portability.
  * 
  * @returns {string} The base URL without trailing slash, e.g., "https://example.com"
  */
 export function getSiteUrl() {
   // Prefer env var if available for deployments, fallback to runtime origin in preview/dev
   const raw =
     (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SITE_URL) ||
     (typeof window !== 'undefined' && window.location && window.location.origin) ||
     '';
 
   // Normalize: remove trailing slash if present
   return raw.endsWith('/') ? raw.slice(0, -1) : raw;
 }
 
 // PUBLIC_INTERFACE
 /**
  * Build an absolute URL given a path by prefixing with the site base URL.
  * 
  * @param {string} path - The path to append, e.g., "/auth/callback" or "auth/callback"
  * @returns {string} Absolute URL, e.g., "https://example.com/auth/callback"
  */
 export function buildAbsoluteUrl(path) {
   const base = getSiteUrl();
   if (!base) return path; // Safe fallback; returns path as-is if base can't be determined
   const normalizedPath = path.startsWith('/') ? path : `/${path}`;
   return `${base}${normalizedPath}`;
 }
