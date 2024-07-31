import React, { useEffect, useReducer, useState } from 'react';

import { THEME } from './constants';
import { Item } from './types';
import CodeMirrorEditor from './CodeMirrorEditor';

type EditorProps = {
  theme: THEME;
  zoomLevel: number;
}

const Tabs = {
  _listeners: [],
  addListener(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    }
  },
  open(file: Item) {
    this._listeners.forEach(listener => listener(file));
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

export default function Editor({ theme, zoomLevel }: EditorProps) {
  const [ openedFiles, setOpenedFiles ] = useReducer(openedFilesReducer, []);

  function closeFile(file: Item) {
    setOpenedFiles({ type: 'close', file });
  }

  useEffect(() => {
    CodeMirrorEditor.init(
      document.querySelector('#editor'),
      theme
    );
    setTimeout(() => {
      CodeMirrorEditor.focus();
      setZoomLevel(zoomLevel);
    }, 0);

    const removeTabsListener = Tabs.addListener((file) => {
      setOpenedFiles({ type: 'open', file });      
    });

    return () => {
      removeTabsListener();
    }
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
            }}
            onClose={() => {
              CodeMirrorEditor.fileClosed();
              closeFile(file);
            }}
            />
        ))}
      </div>
      <div className='p1 flex1 h100' id='editor'></div>
    </div>
  )
}

Editor.Tabs = Tabs;

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