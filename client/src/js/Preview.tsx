import React, { useEffect, useRef } from 'react';
import Editor from './Editor';

type PreviewProps = {
  zoomLevel: number
}

export default function Preview({ zoomLevel }: PreviewProps) {
  const style = {
    width: '100%',
    height: '100%',
    border: 'none',
    overflow: 'hidden',
  }
  useEffect(() => {
    const removeCallback = Editor.instance.addOnSaveCallback(() => {
      const el = document.querySelector('#preview-iframe');
      if (el) {
        el.src = el.src + '';
      }
    });
    return () => {
      removeCallback();
    }
  }, []);

  return (
    <div id="preview">
      <iframe src='/app' frameBorder="0" scrolling="no" style={style} id="preview-iframe" data-zoom-level={zoomLevel} key={`iframe${zoomLevel}`}></iframe>
    </div>
  )
}