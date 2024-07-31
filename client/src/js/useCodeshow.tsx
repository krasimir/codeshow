import { useState, useEffect, useReducer } from 'react';
import { Command, Item } from './types';
import CodeMirrorEditor from './CodeMirrorEditor';

export default function useCodeshow() {
  const [ script, setScript ] = useState(null);
  const [ currentSlideIndex, changeCurrentSlide ] = useReducer(currentSlideReducer, getURLAnchor());

  async function executeSlide() {
    const commands:Command[] = script.slides[currentSlideIndex];
    CodeMirrorEditor.stopCurrentSlide();
    for(const command of commands) {
      const [ commandName, ...commandsArgs ] = command.name.split(':');
      console.log(':: Executing command:', `"${commandName}"`);
      switch(commandName) {
        case 'file':
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
          await CodeMirrorEditor.simulateTyping(command.args, commandsArgs[0] ? Number(commandsArgs[0]) : undefined);
          break;
        case 'pressBackspace':
          await CodeMirrorEditor.pressBackspace(Number(command.args), commandsArgs[0] ? Number(commandsArgs[0]) : undefined);
          break;
        case 'pressEnter':
          await CodeMirrorEditor.pressEnter(Number(command.args), commandsArgs[0] ? Number(commandsArgs[0]) : undefined);
          break;
        default: 
          console.error(`Unknown command: ${command.name}`);
          break;
      }
    }
  }
  function nextSlide() {
    changeCurrentSlide('next');
  }
  function previousSlide() {
    changeCurrentSlide('previous');
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
        const commandRegex = /--- ([\w\d:]+)([\s\S]*?)(?=(--- [\w\d:]+|$))/g;
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
      updateURLAnchor(`#${currentSlideIndex}`);
    }
  }, [ script, currentSlideIndex ]);

  useEffect(() => {
    _loadResources();

    const removeNextSlideListener = CodeMirrorEditor.addEventListener('nextSlide', nextSlide);
    const removePreviousSlideListener = CodeMirrorEditor.addEventListener('previousSlide', previousSlide);

    return () => {
      removeNextSlideListener();
      removePreviousSlideListener();
    }
  }, []);

  return {
    currentSlideIndex,
    maxSlides: script ? script.slides.length : 0,
    nextSlide,
    previousSlide,
    getCurrentSlide: () => script ? script.slides[currentSlideIndex] : null
  }
}

function currentSlideReducer(state, action) {
  switch(action) {
    case 'next':
      return state + 1;
    case 'previous':
      return state - 1;
    default:
      return state;
  }
}
function getParameterByName(name, url = window.location.href) {
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function createFileFromPath(path: string): Item {
  return {
    type: 'file',
    path: path,
    name: path.split('/').pop() as string,
    children: []
  };
}
function updateURLAnchor(anchor: string) {
  window.location.hash = anchor;
}
function getURLAnchor() {
  return Number((window.location.hash || '').replace('#', '') || 0);
}
