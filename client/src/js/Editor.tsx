import React, { useEffect, useState, useRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { indentWithTab } from '@codemirror/commands'
import { dracula as darkTheme } from 'thememirror'; // https://www.npmjs.com/package/thememirror

import { THEME } from './constants';
import FileExplorer from './FileExplorer';

export enum EDITOR_MODE {
  EDITOR,
  FILE_EXPLORER
}

const code = `function Test() {
  return <Hello />
}`;

const lightTheme = EditorView.baseTheme({});

type EditorProps = {
  theme: THEME;
  zoomLevel: number;
  mode: EDITOR_MODE;
}

const CodeMirrorEditor = {
  state: null,
  editor: null,
  themeComp: new Compartment,
  onSave: (code: string) => {},
  onZoomIn: () => {},
  onZoomOut: () => {},
  toggleFileExporer: () => {},
  theme: null,
  init(domElement: any, theme:string) {
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
      createKeyMapping('Mod-=', () => {
        this.onZoomIn();
      }),
      createKeyMapping('Mod--', () => {
        this.onZoomOut();
      }),
      createKeyMapping('Mod-Shift-e', () => {
        this.toggleFileExporer();
      }),
      keymap.of([indentWithTab]),
      basicSetup,
      javascript(),
      this.themeComp.of(this.theme === THEME.LIGHT ? lightTheme : darkTheme)
    ]
  }
}

export default function Editor({ theme, zoomLevel, mode }: EditorProps) {  
  useEffect(() => {
    CodeMirrorEditor.init(
      document.querySelector('#editor'),
      theme
    );
    setTimeout(() => {
      CodeMirrorEditor.focus();
      setZoomLevel(zoomLevel);
    }, 0);
  }, []);

  useEffect(() => {
    CodeMirrorEditor.changeTheme(theme);
  }, [ theme ]);

  useEffect(() => {
    setZoomLevel(zoomLevel);
  }, [ zoomLevel ]);

  return (
    <div onClick={e => {
      e.stopPropagation();
      CodeMirrorEditor.focus();
    }} className='br bl rel'>
      <div className='bb flex pt02 px02'>
        {/* tabs */}
      </div>
      <div className='p1' id='editor'></div>
      {mode === EDITOR_MODE.FILE_EXPLORER && <FileExplorer />}
    </div>
  )
}

Editor.instance = CodeMirrorEditor;

function createKeyMapping(key, callback) {
  return keymap.of([{
    key,
    run() { callback(); return true }
  }])
}
function setZoomLevel(zoomLevel: number) {
  const el = document.querySelector('.cm-editor');
  if (el) {
    document.querySelector('.cm-editor').style.fontSize = `${zoomLevel}em`;
  }
}

function Tab({ file, active, onClick }: { file: string, active?: boolean, onClick: () => void }) {
  return (
    <button className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
      {file}
    </button>
  )
}