import React, { useEffect, useState } from 'react';
import Editor from './Editor';

export type Item = {
  path: string,
  name: string,
  type: 'folder' | 'file',
  children: Item[]
}

type FileExplorerProps = {
  onOpenFile: (item: Item) => void,
  onClose: () => void
}

export default function FileExplorer({ onOpenFile, onClose }: FileExplorerProps) {
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

  function renderDir(item: Item, level = 0) {
    return (
      <div key={item.path}>
        <button className='flex as-link' style={calculateIndent(level)}>
          <img src='./imgs/folder.svg' width={22} className='mr02' />
          <span>{item.name}</span>
        </button>
        {item.children.map(child => (
          child.type === 'folder' ? renderDir(child, level + 1) : renderFile(child, level + 1)
        ))}
      </div>
    )
  }
  function renderFile(item: Item, level = 0) {
    return (
      <button key={item.path} className='flex as-link' style={calculateIndent(level)} onClick={() => {
        onOpenFile(item);
        onClose();
      }}>
        <img src='./imgs/file-text.svg' width={22} className='mr02' />
        <span>{item.name}</span>
      </button>
    )
  }

  return (
    <div className="abs curtain fill fz12" style={{ top: 0, left: 0 }} id="file-explorer">
      <button className="icon abs" style={{ top: '1em', right: '1em' }} onClick={onClose}>
        <img src='./imgs/x-circle.svg' alt='close'/>
      </button>
      {error && <div className='p1'>{error.toString()}</div>}
      <div className='p1'>
        {files.map(dir => renderDir(dir))}
      </div>
    </div>
  ) 
}

function calculateIndent(level: number) {
  return { marginLeft: `${level * 0.8}em` };
}