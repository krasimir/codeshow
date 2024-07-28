import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <p>Hello world</p>
  )
}

window.addEventListener('load', () => {
  const root = createRoot(document.querySelector('#root'));
  root.render(<App />);
});

window.setZoomLevel = function (zoomLevel) {
  document.querySelector('body').style.fontSize = `${zoomLevel}em`;
}