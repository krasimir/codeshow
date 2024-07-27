import React, { useEffect, useState, useRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { dracula as darkTheme } from 'thememirror'; // https://www.npmjs.com/package/thememirror

import { THEME } from './constants';

const code = `function Test() {
  return <Hello />
}`;

const lightTheme = EditorView.baseTheme({});

export default function Editor({ theme }) {
  const editor = useRef(null);
  const themeCompartment = useRef(new Compartment);
  const extensions = [
    createKeyMapping('Mod-s', () => console.log('save')),
    basicSetup,
    javascript(),
    themeCompartment.current.of(theme === THEME.LIGHT ? lightTheme : darkTheme)
  ];

  useEffect(() => {
    let startState = EditorState.create({ doc: code, extensions });
    let e = new EditorView({
      state: startState,
      parent: document.querySelector('#editor'),
    });
    setTimeout(() => {
      editor.current = e;
      editor.current.focus();
    }, 0);
  }, []);

  useEffect(() => {
    if (editor.current) {
      editor.current.dispatch({
        effects: themeCompartment.current.reconfigure(theme === THEME.LIGHT ? lightTheme : darkTheme)
      })
    }
  }, [ theme ]);

  return (
    <div id='editor' className='p1'>

    </div>
  )
}

function createKeyMapping(key, callback) {
  return keymap.of([{
    key,
    run() { callback(); return true }
  }])
}