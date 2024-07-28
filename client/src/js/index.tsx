import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Editor, {EDITOR_MODE} from './Editor';
import Footer from './Footer';
import Preview from './Preview';
import { THEME } from './constants';

const DEFAULT_THEME = localStorage.getItem('codeshow_theme') || THEME.DARK;
const DEFAULT_ZOOM_LEVEL = Number(localStorage.getItem('codeshow_zoom') || 1);

function App() {
  const [ theme, setTheme ] = useState(DEFAULT_THEME);
  const [ zoomLevel, setZoomLevel ] = useState(DEFAULT_ZOOM_LEVEL);
  const [ fileExplorerVisible, setFileExplorerVisible ] = useState(false);

  function onZoomIn() {
    setZoomLevel(zoomLevel + 0.1);
    localStorage.setItem('codeshow_zoom', (zoomLevel + 0.1).toString());
  }
  function onZoomOut() {
    setZoomLevel(zoomLevel - 0.1);
    localStorage.setItem('codeshow_zoom', (zoomLevel - 0.1).toString());
  }

  Editor.instance.onZoomIn = onZoomIn;
  Editor.instance.onZoomOut = onZoomOut;
  Editor.instance.toggleFileExporer = () => {
    setFileExplorerVisible(!fileExplorerVisible);
  }

  return (
    <>
      <div className="grid grid2 flex1">
        <Editor
          theme={theme}
          zoomLevel={zoomLevel}
          mode={fileExplorerVisible ? EDITOR_MODE.FILE_EXPLORER : EDITOR_MODE.EDITOR} />
        <Preview zoomLevel={zoomLevel} />
      </div>
      <Footer
        theme={theme}
        onThemeChange={theme => {
          setTheme(theme);
          localStorage.setItem('codeshow_theme', theme);
        }}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        toggleFileExporer={Editor.instance.toggleFileExporer}
      />
    </>
  )
}

window.addEventListener('load', () => {
  const root = createRoot(document.querySelector('#root'));
  root.render(<App />);
});