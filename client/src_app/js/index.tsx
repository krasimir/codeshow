import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

window.addEventListener('load', () => {
  const root = createRoot(document.querySelector('#root'));
  root.render(<App />);
});

window.setZoomLevel = function (zoomLevel) {
  document.querySelector('body').style.fontSize = `${zoomLevel}em`;
}