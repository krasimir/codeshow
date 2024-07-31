import React, { useEffect, useRef } from 'react';
import CodeMirrorEditor from './CodeMirrorEditor';

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
    const removeCallback = CodeMirrorEditor.addEventListener('save', () => {
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