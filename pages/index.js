import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import ProxyForm from '../components/ProxyForm';
import ResultDisplay from '../components/ResultDisplay';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProxyRequest = async (githubUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      // Extract path from GitHub URL
      const url = new URL(githubUrl);
      const path = url.pathname;
      
      // Make request to our proxy API
      const response = await fetch(`/api/proxy${path}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      setResult({
        content: data,
        contentType: response.headers.get('content-type'),
        url: githubUrl
      });
    } catch (err) {
      setError(err.message);
      console.error('Proxy error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>GitHub Proxy Server</title>
        <meta name="description" content="Access GitHub content through a proxy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="main">
        <h1 className="title">
          GitHub <span className="highlight">Proxy</span> Server
        </h1>
        
        <p className="description">
          Access GitHub content through our proxy server that mimics browser behavior
        </p>
        
        <ProxyForm onSubmit={handleProxyRequest} loading={loading} />
        
        {error && (
          <div className="error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        <ResultDisplay result={result} />
      </main>

      <footer className="footer">
        <p>
          Powered by Next.js and deployed on Vercel
        </p>
      </footer>
    </div>
  );
    }
