import React, { useState } from 'react';
import './App.css';
import Letter from './components/letter';
/* DATABASE */
import db from './resource/db';

function App() {
  const [isOpenAnyLetter, setIsOpenAnyLetter] = useState(false);
  function openLetter() {
    setIsOpenAnyLetter(!isOpenAnyLetter);
  }

  return (
    <div className="App">
      <div className="wrap">
        {
          db.map((value) => {
            return (
              <Letter name={value.name} title={value.title} write={value.write} img={value.img}/>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
