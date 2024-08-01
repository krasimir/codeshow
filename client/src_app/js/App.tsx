import React, { useState } from 'react';

export default function App() {
  function onSubmit(e) {
    e.preventDefault();
  }
  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <div>First name:</div>
        <input type="text" />        
      </fieldset>
      <fieldset className="mt-6 mb-6">
        <div>Are you a web developer?</div>
        <label>
        <input type="radio" name="question"/> Yes
        </label>
        <label className="ml-3">
        <input type="radio" name="question"/> No
        </label>
      </fieldset>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center cursor-pointer">Register</button>
    </form>
  )
}