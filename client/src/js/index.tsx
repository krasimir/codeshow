import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Editor from './Editor';
import Footer from './Footer';
import Preview from './Preview';
import { THEME } from './constants';

const DEFAULT_THEME = localStorage.getItem('codeshow_theme') || THEME.DARK;
const DEFAULT_ZOOM_LEVEL = Number(localStorage.getItem('codeshow_zoom') || 1);

function App() {
  const [ theme, setTheme ] = useState(DEFAULT_THEME);
  const [ zoomLevel, setZoomLevel ] = useState(DEFAULT_ZOOM_LEVEL);

  function onZoomIn() {
    setZoomLevel(zoomLevel + 0.1);
    localStorage.setItem('codeshow_zoom', (zoomLevel + 0.1).toString());
  }
  function onZoomOut() {
    setZoomLevel(zoomLevel - 0.1);
    localStorage.setItem('codeshow_zoom', (zoomLevel - 0.1).toString());
  }

  return (
    <>
      <div className="grid grid2 flex1">
        <Editor
          theme={theme}
          onSave={code => console.log(code)}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          zoomLevel={zoomLevel}/>
        <Preview zoomLevel={zoomLevel}/>
      </div>
      <Footer
        theme={theme}
        onThemeChange={theme => {
          setTheme(theme);
          localStorage.setItem('codeshow_theme', theme);
        }}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
      />
    </>
  )
}

window.addEventListener('load', () => {
  const root = createRoot(document.querySelector('#root'));
  root.render(<App />);
});