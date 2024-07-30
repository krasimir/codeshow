import { useReducer, useState, useEffect } from 'react';
import { Command, Item } from './types';
import Editor from './Editor';

export default function useCodeshow() {
  const [ files, setFiles ] = useState([]);
  const [ script, setScript ] = useState(null);
  const [ currentSlideIndex, setCurrentSlideIndex ] = useState(0);
  const [ openedFiles, setOpenedFiles ] = useReducer(openedFilesReducer, []);

  async function executeSlide() {
    const commands:Command[] = script.slides[currentSlideIndex];
    Editor.instance.stopCurrentSlide();
    for(const command of commands) {
      let file;
      switch(command.name) {
        case 'loadFile':
          if (file = findFileItem(files, command.args)) {
            openFileInATab(file);
          }
          break;
        case 'setActiveFile':
          if (file = findFileItem(files, command.args)) {
            await Editor.instance.openFile(file);
          }
          break;
        case 'setContent':
          Editor.instance.setContent(command.args);
          break;
        case 'save':
          await Editor.instance.save();
          break;
        case 'setCursorAt':
          const [ line, position ] = command.args.split(/, ?/).map(Number);
          Editor.instance.focus();
          Editor.instance.setCursorAt(line, position-1);
          break;
        case 'type':
          await Editor.instance.simulateTyping(command.args);
          break;
        default: 
          console.error(`Unknown command: ${command.name}`);
          break;
      }
    }
  }
  function nextSlide() {
    setCurrentSlideIndex(currentSlideIndex + 1);
  }
  function previousSlide() {
    setCurrentSlideIndex(currentSlideIndex - 1);
  }
  function openFileInATab(file: Item) {
    setOpenedFiles({ type: 'open', file });
  }
  function closeFile(file: Item) {
    setOpenedFiles({ type: 'close', file });
  }
  async function _loadResources() {
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
        const res = await fetch(script);
        const input = await res.text();
        let rawSlides = input.split('=======================================================').map(slide => slide.trim());
        const commandRegex = /--- (\w+)([\s\S]*?)(?=(--- \w+|$))/g;
        const slides = rawSlides.map(slide => {
          const commands: Command[] = [];
          let match;
          while ((match = commandRegex.exec(slide)) !== null) {
            const commandName = match[1];
            const commandArgs = match[2].trim();
            commands.push({ name: commandName, args: commandArgs } as Command);
          }
          return commands;
        });
        setScript({ slides });
      } catch(err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    if (script) {
      executeSlide();
    }
  }, [ script, currentSlideIndex ]);

  useEffect(() => {
    _loadResources();
  }, []);

  return {
    currentSlideIndex,
    maxSlides: script ? script.slides.length : 0,
    nextSlide,
    previousSlide,
    files,
    openFileInATab,
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
  function process(files: Item[], path: string): Item | null {
    for (const file of files) {
      if (file.path.match(new RegExp(path))) {
        return file;
      }
      if (file.children) {
        const found = process(file.children, path);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  const file = process(files, path);
  if (file) {
    return file;
  }
  console.log(`File not found: ${path}`);
  return null;
}
