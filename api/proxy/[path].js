export default async function handler(req, res) {
  // Extract the path from the request
  const { path } = req.query;
  const targetUrl = `https://github.com/${Array.isArray(path) ? path.join('/') : path || ''}`;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Use a realistic browser user agent
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    
    // Fetch the content from GitHub
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
        'TE': 'Trailers',
      },
      redirect: 'manual' // Handle redirects manually
    });
    
    // Check if the response is a redirect
    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      // If it's a redirect, send the redirect location
      const location = response.headers.get('location');
      res.setHeader('Location', location);
      return res.status(response.status).end();
    }
    
    // Get the response content type
    const contentType = response.headers.get('content-type') || 'text/html';
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Proxy-Server', 'GitHub-Proxy');
    
    // Copy other headers (except those that should not be proxied)
    const headersToCopy = [
      'cache-control',
      'etag',
      'last-modified',
      'content-encoding',
      'content-length'
    ];
    
    headersToCopy.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });
    
    // Handle different content types
    if (contentType.includes('text/html')) {
      // For HTML content, we might need to rewrite URLs
      let html = await response.text();
      
      // Rewrite URLs to go through our proxy
      html = html.replace(
        /(href|src)=("|')(https?:\/\/github\.com)?\//g, 
        `$1=$2/api/proxy/`
      );
      
      // Send the modified HTML
      return res.status(response.status).send(html);
    } else if (contentType.includes('application/json')) {
      // For JSON content, just pass it through
      const json = await response.json();
      return res.status(response.status).json(json);
    } else {
      // For other content types (images, CSS, JS), stream the data
      const buffer = await response.arrayBuffer();
      return res.status(response.status).send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy error', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
