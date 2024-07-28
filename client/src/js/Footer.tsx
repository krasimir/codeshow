import React, { useEffect } from 'react';

import { THEME } from './constants';

export default function Footer({ theme, onThemeChange, onZoomIn, onZoomOut, toggleFileExporer }) {

  function applyNewTheme(newTheme) {
    if (newTheme === THEME.DARK) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    onThemeChange(newTheme);
  }

  useEffect(() => {
    applyNewTheme(theme);
  }, []);

  return (
    <div className='flex p1 bl bb br bt' id='footer'>
      <div>
        <button className="icon" onClick={() => {
            applyNewTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
        }}>
          <img src={theme === THEME.LIGHT ? './imgs/moon.svg' : './imgs/sun.svg'} alt='switch theme'/>
        </button>
        <button className="icon" onClick={() => onZoomOut()}>
          <img src='./imgs/minus-circle.svg' alt='zoom out' />
        </button>
        <button className="icon" onClick={() => onZoomIn()}>
          <img src='./imgs/plus-circle.svg' alt='zoom in' />
        </button>
        <button className="icon" onClick={() => toggleFileExporer()}>
          <img src='./imgs/file-text.svg' alt='toggle file explorer' />
        </button>
      </div>
    </div>
  )
}