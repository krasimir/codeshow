import React from 'react';
import { createRoot } from 'react-dom/client';

import Editor from './Editor';

function App() {
  return (
    <div className="grid grid2">
      <Editor />
      <div>preview</div>
    </div>
  )
}

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
