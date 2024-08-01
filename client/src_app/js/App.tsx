import React, { useState } from 'react';

export default function App() {
  const [ answer, setAnswer ] = useState(null);

  return (
    <div>
      <div>
        <div>First name:</div>
        <input type="text" />        
      </div>
      <div class="mt-6 mb-6">
        <div>Are you a web developer?</div>
        <input type="radio" checked={answer === 'yes'} onClick={() => setAnswer('yes')}/> 
        <span onClick={() => setAnswer('yes')} class="mr-3">Yes</span>
        <input type="radio" checked={answer === 'no'} onClick={() => setAnswer('no')}/> 
        <span onClick={() => setAnswer('no')}>No</span>
      </div>
      <div class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center" style={{ cursor: "pointer" }}>Register</div>
    </div>
  )
}