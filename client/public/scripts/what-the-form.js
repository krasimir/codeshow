window.CODESHOW_SCRIPT = {
  slides: [
    {
      description: 'Initial',
      commands: [
        { loadFile: 'js/App.tsx'},
        { loadFile: 'css/index.css'},
        { setActiveFile: 'js/App.tsx'},
        { setContent: `import React from 'react';

export default function App() {
  return (
    <div>
      Hello world
    </div>
  )
}`      },
        { save: true }
      ]
    },
    {
      description: 'The form ...',
      commands: [
        { setContent: `import React from 'react';

export default function App() {
  return (
    <div>
      
    </div>
  )
}`      },
        { save: true },
        { setCursorAt: [ 6, 7 ] },
        { type: `<form>
        test
      </form>` },
        { save: true }
      ]
    }
  ]
}