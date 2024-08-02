import React, { useEffect } from 'react';

import { THEME } from './constants';

export default function Footer({ theme, onThemeChange, onZoomIn, onZoomOut, onPreviousSlide, onNextSlide, currentSlideIndex, maxSlides, currentSlide, waitingFor }) {

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
      <div className="flex">
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
        {maxSlides !== 0 && (
          <>
            <div className='separatlor mx05'></div>
            <button className="icon" onClick={() => onPreviousSlide()} disabled={currentSlideIndex === 0}>
              <img src='./imgs/arrow-left-circle.svg' alt='previous slide' />
            </button>
            <div className='current-slide mx05'>
              {currentSlideIndex+1}/{maxSlides}
            </div>
            <button className="icon" onClick={() => onNextSlide()} disabled={currentSlideIndex === maxSlides-1}>
              <img src='./imgs/arrow-right-circle.svg' alt='previous slide' />
            </button>
            <div className='separatlor mx05'></div>
            <div>{waitingFor ? <small>(F12)</small> : <small>(F9)</small>}</div>
          </>
        )}
      </div>
    </div>
  )
}