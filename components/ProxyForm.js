import { useState } from 'react';

export default function ProxyForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };
  
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter GitHub URL (e.g., https://github.com/facebook/react)"
            disabled={loading}
            className="input"
          />
          <button 
            type="submit" 
            disabled={loading || !url.trim()}
            className="button"
          >
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </div>
      </form>
      
      <div className="examples">
        <p>Try these examples:</p>
        <div className="example-links">
          <button onClick={() => setUrl('https://github.com/facebook/react')}>
            facebook/react
          </button>
          <button onClick={() => setUrl('https://github.com/vercel/next.js')}>
            vercel/next.js
          </button>
          <button onClick={() => setUrl('https://github.com/torvalds/linux')}>
            torvalds/linux
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .form-container {
          margin: 2rem 0;
        }
        
        .form {
          width: 100%;
        }
        
        .input-group {
          display: flex;
          gap: 0.5rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .input:focus {
          border-color: var(--secondary-color);
          box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
        }
        
        .button {
          padding: 0.75rem 1.5rem;
          background-color: var(--secondary-color);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .button:hover:not(:disabled) {
          background-color: #0256b3;
        }
        
        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .examples {
          margin-top: 1rem;
          text-align: center;
          color: var(--light-text);
        }
        
        .example-links {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        
        .example-links button {
          padding: 0.25rem 0.5rem;
          background: none;
          border: none;
          color: var(--secondary-color);
          cursor: pointer;
          text-decoration: underline;
        }
        
        .example-links button:hover {
          color: #0256b3;
        }
        
        @media (max-width: 768px) {
          .input-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
