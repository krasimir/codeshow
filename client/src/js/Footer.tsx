import React, { useState } from 'react';

import { THEME } from './constants';

export default function Footer({ theme, onThemeChange }) {
  return (
    <div className='flex'>
      <button className="icon">
        <img src={theme === THEME.LIGHT ? './imgs/moon.svg' : './imgs/sun.svg'} alt='switch theme' onClick={() => {
          if (theme === THEME.LIGHT) {
            document.body.classList.add(THEME.DARK);
            onThemeChange(THEME.DARK);
          } else {
            document.body.classList.remove(THEME.DARK);
            onThemeChange(THEME.LIGHT);
          }
        }}/>
      </button>
    </div>
  )
}