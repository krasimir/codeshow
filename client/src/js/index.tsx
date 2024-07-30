import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import Editor from './Editor';
import Footer from './Footer';
import Preview from './Preview';
import { THEME } from './constants';
import useCodeshow from './useCodeshow';
import FileExplorer from './FileExplorer';
import { Item } from './types';

const DEFAULT_THEME = localStorage.getItem('codeshow_theme') || THEME.DARK;
const DEFAULT_ZOOM_LEVEL = Number(localStorage.getItem('codeshow_zoom') || 1);

function App() {
  const [ theme, setTheme ] = useState(DEFAULT_THEME);
  const [ zoomLevel, setZoomLevel ] = useState(DEFAULT_ZOOM_LEVEL);
  const [ fileExplorerVisible, setFileExplorerVisible ] = useState(false);
  const {
    getCurrentSlide,
    currentSlideIndex,
    maxSlides,
    nextSlide,
    previousSlide,
    files,
    openFileInATab,
    closeFile,
    openedFiles
  } = useCodeshow();

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
          openFile={openFileInATab}
          closeFile={closeFile}
          openedFiles={openedFiles}
        >
          {fileExplorerVisible && <FileExplorer
              files={files}
              onOpenFile={(item: Item) => {
                openFileInATab(item);
                Editor.instance.openFile(item);
              }}
              onClose={() => {
                Editor.instance.toggleFileExporer();
              }}/>}
        </Editor>
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
        currentSlideIndex={currentSlideIndex}
        maxSlides={maxSlides}
        onNextSlide={nextSlide}
        onPreviousSlide={previousSlide}
        currentSlide={getCurrentSlide()}
      />
    </>
  )
}

window.addEventListener('load', () => {
  const root = createRoot(document.querySelector('#root'));
  root.render(<App />);
});