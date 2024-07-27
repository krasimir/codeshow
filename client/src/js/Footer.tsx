import React, { useEffect } from 'react';

import { THEME } from './constants';

export default function Footer({ theme, onThemeChange }) {

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
    <div className='flex p1' id="footer">
      <button className="icon">
        <img src={theme === THEME.LIGHT ? './imgs/moon.svg' : './imgs/sun.svg'} alt='switch theme' onClick={() => {
          applyNewTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
        }}/>
      </button>
    </div>
  )
}