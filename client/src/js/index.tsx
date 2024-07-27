import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Editor from './Editor';
import Footer from './Footer';
import Preview from './Preview';
import { THEME } from './constants';

const DEFAULT_THEME = THEME.LIGHT;

function App() {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  return (
    <>
      <div className="grid grid2 flex1">
        <Editor theme={theme} />
        <Preview />
      </div>
      <Footer theme={theme} onThemeChange={theme => {
        setTheme(theme);
      }}/>
    </>
  )
}

window.addEventListener('load', () => {
  const root = createRoot(document.querySelector('#root'));
  root.render(<App />);
});