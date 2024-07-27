import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { javascript } from "@codemirror/lang-javascript"

import React, { useEffect, useState } from 'react';

export default function Editor() {

  useEffect(() => {
    let startState = EditorState.create({
      doc: `function Test() {
  return <Hello />
}`,
      extensions: [
        createKeyMapping('Mod-s', () => console.log('save')),
        basicSetup,
        javascript()
      ]
    })
    
    let view = new EditorView({
      state: startState,
      parent: document.querySelector('#editor'),
    });
    setTimeout(() => {
      view.focus();
    }, 0);
  }, []);

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