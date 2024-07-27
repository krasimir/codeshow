import React from 'react';

export default function Preview() {
  const style = {
    width: '100%',
    height: '100%',
    border: 'none',
    overflow: 'hidden',
  }
  return (
    <div id="preview">
      <iframe src='/app' frameBorder="0" scrolling="no" style={style}></iframe>
    </div>
  )
}