import { EditorState, Compartment, EditorSelection } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { indentWithTab } from '@codemirror/commands'
import { dracula as darkTheme } from 'thememirror'; // https://www.npmjs.com/package/thememirror

import { THEME } from './constants';
import { Item } from './types';

const lightTheme = EditorView.baseTheme({});
const DEFAULT_IFRAME_REFRASH_TIME = 700;
const TYPING_DELAY = 60;

const CodeMirrorEditor = {
  // private
  _state: null,
  _themeComp: new Compartment,
  _editor: null,
  _theme: null,
  _currentFile: null as Item | null,
  _listeners: {},
  _extensions() {
    return [
      createKeyMapping('Mod-s', () => {
        this.save();
      }),
      createKeyMapping('Mod-=', () => {
        this.onZoomIn();
      }),
      createKeyMapping('Mod--', () => {
        this.onZoomOut();
      }),
      createKeyMapping('F9', () => {
        this._dispatch('nextSlide');
      }),
      createKeyMapping('F7', () => {
        this._dispatch('previousSlide');
      }),
      createKeyMapping('F12', () => {
        this._dispatch('F12');
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
  _dispatch(event, data) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(listener => listener(data));
  },

  // public
  onZoomIn: () => {},
  onZoomOut: () => {},
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
  addEventListener(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
    return () => {
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);      
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
      this._dispatch('open', file);
    } catch(err) {
      console.log(err);
      this._changeContent(err.message);
    }
  },
  async fileClosed() {
    this._currentFile = null;
    this._changeContent('');
  },
  setContent(code: string) {
    return this._changeContent(code);
  },
  async save() {
    const code = this._editor.state.doc.toString();
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
        this._dispatch('save', this._currentFile);
      }, DEFAULT_IFRAME_REFRASH_TIME);
    } catch(err) {
      console.log(err);
    }
  },
  setCursorAt(line: number, position: number) {
    this._editor.dispatch({
      selection: {
        anchor: this._editor.state.doc.line(line).from + position
      }
    });
  },
  type(text: string) {
    this._editor.dispatch({
      changes: { from: this._editor.state.selection.main.head, insert: text }
    });
  },
  simulateTyping(text: string, delay: number = TYPING_DELAY) {
    return new Promise((resolve) => {
      let i = 0;
      this.typingInterval = setInterval(() => {
        if (i === text.length) {
          clearInterval(this.typingInterval);
          resolve(true);
          return;
        }
        this.type(text[i]);
        const currentPosition = this._editor.state.selection.ranges[0].from;
        this._editor.dispatch({
          selection: {
            anchor: currentPosition + 1
          }
        });
        i++;
      }, delay);
    });
  },
  stopCurrentSlide() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
  async pressBackspace(times = 1, delay = TYPING_DELAY) {
    return new Promise(async (resolve) => {
      this.typingInterval = setInterval(() => {
        if (times === 0) {
          clearInterval(this.typingInterval);
          resolve(true);
          return;
        }
        this._editor.dispatch({
          changes: { from: this._editor.state.selection.main.head - 1, to: this._editor.state.selection.main.head }
        });
        times--;
      }
      , delay);
    })
  },
  async pressEnter(times = 1, delay = TYPING_DELAY) {
    return new Promise(async (resolve) => {
      this.typingInterval = setInterval(() => {
        if (times === 0) {
          clearInterval(this.typingInterval);
          resolve(true);
          return;
        }
        const state = this._editor.state;
        let cursor = state.selection.main.to;

        let newlineTransaction = {
          changes: { from: cursor, to: cursor, insert: "\n" },
          userEvent: "input",
          scrollIntoView: true,
          selection: EditorSelection.cursor(cursor + 1),
        };
        this._editor.dispatch(newlineTransaction);
        times--;
      }
      , delay);
    })
  },
  simulateF12() {
    this._editor.focus();
    setTimeout(() => {
      this._dispatch('F12');
    }, 10);
  }
}

function createKeyMapping(key, callback) {
  return keymap.of([{
    key,
    run() { callback(); return true }
  }])
}
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default CodeMirrorEditor;