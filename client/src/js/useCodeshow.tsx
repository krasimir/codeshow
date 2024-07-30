import { useReducer, useState, useEffect } from 'react';
import { Item, Script, Slide } from './types';
import Editor from './Editor';

export default function useCodeshow() {
  const [ files, setFiles ] = useState([]);
  const [ script, setScript ] = useState(null);
  const [ currentSlideIndex, setCurrentSlideIndex ] = useState(0);
  const [ openedFiles, setOpenedFiles ] = useReducer(openedFilesReducer, []);

  async function executeSlide() {
    const slide:Slide = script.slides[currentSlideIndex];
    for(const command of slide.commands) {
      if (command['setActiveFile']) { // -------------------------------------------------- setActiveFile
        const file = findFileItem(files, command['setActiveFile']);
        if (file) {
          await Editor.instance.openFile(file);
        } else {
          console.error(`File not found: ${command['setActiveFile']}`);
        }
      } else if (command['loadFile']) { // -------------------------------------------------- loadFile
        const file = findFileItem(files, command['loadFile']);
        if (file) {
          await openFile(file);
        } else {
          console.error(`File not found: ${command['loadFile']}`);
        }
      } else if (command['setContent']) { // -------------------------------------------------- setContent
        Editor.instance.setContent(command['setContent']);
      } else if (command['save']) { // -------------------------------------------------- setContent
        await Editor.instance.save();
      } else if (command['setCursorAt']) { // -------------------------------------------------- setCursorAt
        Editor.instance.focus();
        Editor.instance.setCursorAt(command['setCursorAt'][0], command['setCursorAt'][1]-1);
      } else if (command['type']) { // -------------------------------------------------- setCursorAt
        await Editor.instance.simulateTyping(command['type']);
      }
    }
  }
  function nextSlide() {
    setCurrentSlideIndex(currentSlideIndex + 1);
  }
  function previousSlide() {
    setCurrentSlideIndex(currentSlideIndex - 1);
  }
  function openFile(file: Item) {
    setOpenedFiles({ type: 'open', file });
  }
  function closeFile(file: Item) {
    setOpenedFiles({ type: 'close', file });
  }
  async function loadResources() {
    // loading files
    try {
      const res = await fetch('/api/files');
      if (!res.ok) {
        throw new Error('Failed to fetch files');
      }
      const files = await res.json();
      setFiles(files);
    } catch(err) {
      console.error(err);
    }
    // loading script
    const script = getParameterByName('script');
    if (!script) {
      console.error('No "script" GET param provided.');
    } else {
      try {
        await loadJavaScript(script);
        if (!window.CODESHOW_SCRIPT) {
          console.error('No CODESHOW_SCRIPT global variable found in the loaded script.');
        } else {
          const script = window.CODESHOW_SCRIPT as Script;
          setScript(script);
        }
      } catch(err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    if (script) {
      executeSlide();
    }
  }, [script, currentSlideIndex ]);

  return {
    name: script ? script.name : '',
    currentSlideIndex,
    maxSlides: script ? script.slides.length : 0,
    nextSlide,
    previousSlide,
    files,
    loadResources,
    openFile,
    closeFile,
    openedFiles,
    getCurrentSlide: () => script ? script.slides[currentSlideIndex] : null
  }
}

function getParameterByName(name, url = window.location.href) {
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
async function loadJavaScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
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
function findFileItem(files: Item[], path: string): Item | null {
  for (const file of files) {
    if (file.path.match(new RegExp(path))) {
      return file;
    }
    if (file.children) {
      const found = findFileItem(file.children, path);
      if (found) {
        return found;
      }
    }
  }
  return null;
}