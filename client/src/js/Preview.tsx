import React, { useEffect, useRef } from 'react';

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
  const interval = useRef(null);

  function passZoomLevelToIframe() {
    const el = document.querySelector('#preview-iframe');
    if (el && el.contentWindow && el.contentWindow.setZoomLevel) {
      el.contentWindow.setZoomLevel(zoomLevel);
      return;
    }
    interval.current = setTimeout(passZoomLevelToIframe, 100);
  }

  useEffect(() => {
    passZoomLevelToIframe();
    return () => {
      clearTimeout(interval.current);
    }
  }, [ zoomLevel ])

  return (
    <div id="preview">
      <iframe src='/app' frameBorder="0" scrolling="no" style={style} id="preview-iframe"></iframe>
    </div>
  )
}