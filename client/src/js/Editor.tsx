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

type EditorProps = {
  theme: THEME;
  onSave: (code: string) => void;
}

const CodeMirrorEditor = {
  state: null,
  editor: null,
  themeComp: new Compartment,
  onSave: () => {},
  theme: null,
  init(domElement: any, theme:string, onSave: Function) {
    this.onSave = onSave;
    this.theme = theme;
    this.state = EditorState.create({ doc: code, extensions: this._extensions() });
    this.editor = new EditorView({
      state: this.state,
      parent: domElement,
    });
  },
  changeContent(newCode: string) {
    this.editor.current.setState(
      EditorState.create({ doc: newCode, extensions: this._extensions() })
    );
  },
  focus() {
    if (this.editor === null) return;
    this.editor.focus();
  },
  changeTheme(theme) {
    if (this.editor === null) return;
    this.theme = theme;
    this.editor.dispatch({
      effects: this.themeComp.reconfigure(theme === THEME.LIGHT ? lightTheme : darkTheme)
    });
  },
  _extensions() {
    return [
      createKeyMapping('Mod-s', () => {
        this.onSave(this.editor.state.doc.toString());
      }),
      basicSetup,
      javascript(),
      this.themeComp.of(this.theme === THEME.LIGHT ? lightTheme : darkTheme)
    ]
  }
}

export default function Editor({ theme, onSave }: EditorProps) {
  useEffect(() => {
    CodeMirrorEditor.init(
      document.querySelector('#editor'),
      theme,
      onSave
    );
    setTimeout(() => {
      CodeMirrorEditor.focus();
    }, 0);
  }, []);

  useEffect(() => {
    CodeMirrorEditor.changeTheme(theme);
  }, [ theme ]);

  return (
    <div id='editor' className='p1'></div>
  )
}

Editor.instance = CodeMirrorEditor;

function createKeyMapping(key, callback) {
  return keymap.of([{
    key,
    run() { callback(); return true }
  }])
}