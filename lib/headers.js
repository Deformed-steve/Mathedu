// Function to filter and modify headers
export function processHeaders(headers) {
  const forbiddenHeaders = [
    'host',
    'origin',
    'referer',
    'content-length',
    'accept-encoding',
    'connection'
  ];
  
  const newHeaders = {};
  
  for (const [key, value] of Object.entries(headers)) {
    if (!forbiddenHeaders.includes(key.toLowerCase())) {
      newHeaders[key] = value;
    }
  }
  
  return newHeaders;
}
