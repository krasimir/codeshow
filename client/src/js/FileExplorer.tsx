import React, { useEffect, useState } from 'react';

export default function FileExplorer() {
  const [ error, setError ] = useState(null);
  const [ files, setFiles ] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/files');
        if (!res.ok) {
          throw new Error('Failed to fetch files');
        }
        const files = await res.json();
        setFiles(files);
      } catch(err) {
        setError(err)
      }
    })();    
  }, []);

  return (
    <div className="abs curtain fill" style={{ top: 0, left: 0 }}>
      {error && <div className='p1'>{error.toString()}</div>}
      
    </div>
  ) 
}