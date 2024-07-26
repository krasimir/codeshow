import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return <div>Hello world</div>;
}

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
