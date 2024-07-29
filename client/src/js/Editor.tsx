import React, { useEffect, useReducer, useState } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { indentWithTab } from '@codemirror/commands'
import { dracula as darkTheme } from 'thememirror'; // https://www.npmjs.com/package/thememirror

import { THEME } from './constants';
import { Item } from './types';

const lightTheme = EditorView.baseTheme({});
const DEFAULT_IFRAME_REFRASH_TIME = 1000;

const CodeMirrorEditor = {
  // private
  _state: null,
  _themeComp: new Compartment,
  _editor: null,
  _theme: null,
  _currentFile: null as Item | null,
  _onSaveCallbacks: [],
  _extensions() {
    return [
      createKeyMapping('Mod-s', () => {
        this.onSave(this._editor.state.doc.toString());
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
      this._themeComp.of(this._theme === THEME.LIGHT ? lightTheme : darkTheme),
      EditorView.lineWrapping
    ]
  },
  _changeContent(newCode: string) {
    this._editor.setState(
      EditorState.create({ doc: newCode, extensions: this._extensions() })
    );
  },

  // public
  onZoomIn: () => {},
  onZoomOut: () => {},
  toggleFileExporer: () => {},
  getCurrentFile(): Item | null {
    return this._currentFile;
  },
  init(domElement: any, theme:string) {
    this._theme = theme;
    this._state = EditorState.create({ doc: '', extensions: this._extensions() });
    this._editor = new EditorView({
      state: this._state,
      parent: domElement,
    });
  },
  focus() {
    if (this._editor === null) return;
    this._editor.focus();
  },
  changeTheme(theme) {
    if (this._editor === null) return;
    this._theme = theme;
    this._editor.dispatch({
      effects: this._themeComp.reconfigure(theme === THEME.LIGHT ? lightTheme : darkTheme)
    });
  },
  addOnSaveCallback(callback) {
    this._onSaveCallbacks.push(callback);
    return () => {
      this._onSaveCallbacks = this._onSaveCallbacks.filter(cb => cb !== callback);
    }
  },
  async openFile(file: Item) {
    try {
      this._currentFile = file;
      this._changeContent(`Loading ${file.name} ...`);
      const res = await fetch(`/api/file?path=${file.path}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch file ${file.name}`);
      }
      const code = await res.json();
      this._changeContent(code.content);
    } catch(err) {
      console.log(err);
      this._changeContent(err.message);
    }
  },
  async fileClosed() {
    this._currentFile = null;
    this._changeContent('');
  },
  async onSave(code: string) {
    if (this._currentFile === null) return;
    try {
      await fetch('/api/file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: this._currentFile.path,
          content: code
        })
      });
      setTimeout(() => {
        this._onSaveCallbacks.forEach(cb => cb());
      }, DEFAULT_IFRAME_REFRASH_TIME);
    } catch(err) {
      console.log(err);
    }
  }
}

type EditorProps = {
  theme: THEME;
  zoomLevel: number;
  children?: any;
  openedFiles: Item[];
  openFile: (file: Item) => void;
  closeFile: (file: Item) => void;
}

export default function Editor({ theme, zoomLevel, children, openedFiles, openFile, closeFile }: EditorProps) {

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
    }} className='br bl rel ohidden flex flex-column'>
      <div className='bb flex pt02 px02'>
        {openedFiles.map((file, i) => (
          <Tab
            key={file.name}
            file={file.name}
            active={file.path === CodeMirrorEditor.getCurrentFile()?.path}
            onClick={() => {
              CodeMirrorEditor.openFile(file);
              openFile(file);
            }}
            onClose={() => {
              CodeMirrorEditor.fileClosed();
              closeFile(file);
            }}
            />
        ))}
      </div>
      <div className='p1 flex1 h100' id='editor'></div>
      {children}
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

type TabProps = {
  file: string;
  active?: boolean;
  onClick: () => void;
  onClose: () => void;
  key: string
}

function Tab({ file, active, onClick, onClose, key }: TabProps) {
  return (
    <button className={`tab flex ${active ? 'active' : ''}`} onClick={onClick}>
      {file}
      <span onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}>
        <img src='./imgs/x-circle.svg' alt='close' width={18} />
      </span>
    </button>
  )
}