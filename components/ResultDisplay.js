export default function ResultDisplay({ result }) {
  if (!result) return null;
  
  const isHtml = result.contentType?.includes('text/html');
  const isJson = result.contentType?.includes('application/json');
  
  return (
    <div className="result-container">
      <div className="result-header">
        <h3>Content from {result.url}</h3>
        <span className="content-type">{result.contentType}</span>
      </div>
      
      <div className="result-content">
        {isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: result.content }} />
        ) : isJson ? (
          <pre>{JSON.stringify(JSON.parse(result.content), null, 2)}</pre>
        ) : (
          <pre>{result.content}</pre>
        )}
      </div>
      
      <style jsx>{`
        .result-container {
          margin: 2rem 0;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          overflow: hidden;
        }
        
        .result-header {
          padding: 1rem;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .content-type {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        
        .result-content {
          padding: 1rem;
          background-color: white;
          max-height: 60vh;
          overflow: auto;
        }
        
        .result-content :global(img) {
          max-width: 100%;
        }
        
        .result-content :global(a) {
          color: var(--secondary-color);
        }
        
        .result-content :global(pre) {
          white-space: pre-wrap;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
