import React, { useState } from 'react';

export default function App() {
  function onSubmit() {
    // ...
  }
  return (
    <form>
      <fieldset>
        <div>First name:</div>
        <input type="text" />        
      </fieldset>
      <fieldset className="mt-6 mb-6">
        <div>Are you a web developer?</div>
        <input type="radio" /> Yes
        <input type="radio" /> No
      </fieldset>
      <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center cursor-pointer" onClick={onSubmit}>Register</div>
    </form>
  )
}