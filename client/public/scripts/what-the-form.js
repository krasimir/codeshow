window.CODESHOW_SCRIPT = {
  slides: [
    {
      description: 'Initial',
      commands: [
        { editFile: 'js/App.tsx'},
        { openFile: 'css/index.css'}
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
}`}
      ]
    }
  ]
}