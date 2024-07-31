import { useState, useEffect } from 'react';
import { Command, Item } from './types';
import CodeMirrorEditor from './CodeMirrorEditor';
import Editor from './Editor';

export default function useCodeshow() {
  const [ script, setScript ] = useState(null);
  const [ currentSlideIndex, setCurrentSlideIndex ] = useState(0);

  async function executeSlide() {
    const commands:Command[] = script.slides[currentSlideIndex];
    CodeMirrorEditor.stopCurrentSlide();
    for(const command of commands) {
      let file;
      console.log(':: Executing command:', command);
      switch(command.name) {
        case 'file':
          Editor.Tabs.open(createFileFromPath(command.args));
          break;
        case 'loadFile':
          await CodeMirrorEditor.openFile(createFileFromPath(command.args));
          break;
        case 'setContent':
          CodeMirrorEditor.setContent(command.args);
          break;
        case 'save':
          await CodeMirrorEditor.save();
          break;
        case 'setCursorAt':
          const [ line, position ] = command.args.split(/, ?/).map(Number);
          CodeMirrorEditor.focus();
          CodeMirrorEditor.setCursorAt(line, position-1);
          break;
        case 'type':
          await CodeMirrorEditor.simulateTyping(command.args);
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
  async function _loadResources() {
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
function createFileFromPath(path: string): Item {
  return {
    type: 'file',
    path: path,
    name: path.split('/').pop() as string,
    children: []
  };
}
