import React from 'react';

export default function App() {
  return (
    <div>
      <div>
        <div>First name:</div>
        <input type="text" />        
      </div>
      <div className="mt-6 mb-6">
        <div>Are you a web developer?</div>
        <input type="radio" /> Yes
        <input type="radio" /> No
      </div>
      <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center cursor-pointer">Register</div>
    </div>
  )
}