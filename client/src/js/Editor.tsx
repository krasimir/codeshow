import React, { useEffect, useReducer, useState } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { indentWithTab } from '@codemirror/commands'
import { dracula as darkTheme } from 'thememirror'; // https://www.npmjs.com/package/thememirror

import { THEME } from './constants';
import FileExplorer, { Item } from './FileExplorer';

export enum EDITOR_MODE {
  EDITOR,
  FILE_EXPLORER
}

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
  onZoomIn: () => {},
  onZoomOut: () => {},
  toggleFileExporer: () => {},
  theme: null,
  currentFile: null as Item | null,
  init(domElement: any, theme:string) {
    this.theme = theme;
    this.state = EditorState.create({ doc: '', extensions: this._extensions() });
    this.editor = new EditorView({
      state: this.state,
      parent: domElement,
    });
  },
  onSave(code: string) {
    if (this.currentFile === null) return;
    try {
      fetch('/api/file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: this.currentFile.path,
          content: code
        })
      });
    } catch(err) {
      console.log(err);
    }
  },
  changeContent(newCode: string) {
    this.editor.setState(
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
  async openFile(file: Item) {
    try {
      this.currentFile = file;
      this.changeContent(`Loading ${file.name} ...`);
      const res = await fetch(`/api/file?path=${file.path}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch file ${file.name}`);
      }
      const code = await res.json();
      this.changeContent(code.content);
    } catch(err) {
      console.log(err);
      this.changeContent(err.message);
    }
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
      this.themeComp.of(this.theme === THEME.LIGHT ? lightTheme : darkTheme),
      EditorView.lineWrapping
    ]
  }
}

function openedFilesReducer(files: Item[], action: { type: 'open' | 'close', file: Item }) {
  switch (action.type) {
    case 'open':
      if (files.find(file => file.name === action.file.name)) {
        return [...files];
      }
      return files.concat(action.file);
    case 'close':
      return files.filter(file => file.name !== action.file.name);
    default:
      return files;
  }
}

export default function Editor({ theme, zoomLevel, mode }: EditorProps) {
  const [ openedFiles, setOpenedFiles ] = useReducer(openedFilesReducer, []);

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
            active={file.path === CodeMirrorEditor.currentFile?.path}
            onClick={() => {
              CodeMirrorEditor.openFile(file);
              setOpenedFiles({ type: 'open', file });
            }}
            />
        ))}
      </div>
      <div className='p1 flex1 h100' id='editor'></div>
      {mode === EDITOR_MODE.FILE_EXPLORER && <FileExplorer
        onOpenFile={(item: Item) => {
          setOpenedFiles({ type: 'open', file: item });
          CodeMirrorEditor.openFile(item);
        }}
        onClose={() => {
          CodeMirrorEditor.toggleFileExporer();
        }}/>}
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

function Tab({ file, active, onClick, key }: { file: string, active?: boolean, onClick: () => void, key: string }) {
  return (
    <button className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
      {file}
    </button>
  )
}