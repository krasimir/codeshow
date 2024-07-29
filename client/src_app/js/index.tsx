import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

window.addEventListener('load', () => {
  const root = createRoot(document.querySelector('#root'));
  root.render(<App />);

  // reading the zoom level
  const iframes = window.parent.document.getElementsByTagName('iframe');
  for (var i = 0; i < iframes.length; i++) {
    if (iframes[i].contentWindow === window) {
        const zoomLevel = Number(iframes[i].getAttribute('data-zoom-level') || 1);
        setZoomLevel(zoomLevel);
        break;
    }
}
});

function setZoomLevel(zoomLevel) {
  document.querySelector('body').style.fontSize = `${zoomLevel}em`;
}