import { useReducer, useState } from 'react';
import { Item, Script, Slide } from './types';

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

export default function useCodeshow() {
  const [ error, setError ] = useState(null);
  const [ files, setFiles ] = useState([]);
  const [ script, setScript ] = useState(null);
  const [ currentSlide, setCurrentSlide ] = useState(0);
  const [ openedFiles, setOpenedFiles ] = useReducer(openedFilesReducer, []);

  async function executeSlide(slide: Slide) {
    for(const command of slide.commands) {
      if (command['openFile']) {
        
      }
    }
  }
  function nextSlide() {

  }
  function previousSlide() {

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
      setError(err)
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
          executeSlide(script.slides[currentSlide]);
        }
      } catch(err) {
        console.error(err);
      }
    }
  }

  return {
    name: script ? script.name : '',
    currentSlide,
    maxSlides: script ? script.slides.length : 0,
    nextSlide,
    previousSlide,
    files,
    loadResources,
    openFile: (file: Item) => {
      setOpenedFiles({ type: 'open', file });
    },
    closeFile: (file: Item) => {
      setOpenedFiles({ type: 'close', file });
    },
    openedFiles
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