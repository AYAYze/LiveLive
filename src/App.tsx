import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Route, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import LetterPanel from './components/LetterPanel';
import Letter from './components/Letter';
import './App.css';
import LetterInfo from './types/LetterInfo';
import Post from './components/NewPost';



const LETTERS = gql`
  query Letters {
    Letters {
      id,
      author,
      title,
      thumb,
    }
  }
`




function App() {

  const { loading, error, data } = useQuery(LETTERS);
  const letters: LetterInfo[] = data?.Letters ?? [];

  return (
    <div className="App">
      <div className="wrap">
        {
          letters.map(letter => {
            return (
              <Link key={letter.id} to={`/letter/${letter.id}`} className="openLetter">
                <LetterPanel {...letter}/>
              </Link>
              
            )
          })
        }
      </div>
      <Newpost_button />

      <Route exact path={`/post`}>
        <Post/>
      </Route>
      <Route exact path={`/letter/:id`}>
        <Letter/>
      </Route>

    </div>
  );
}

function Newpost_button() {
  return (
    <Link to={`/post`}>
      <div className="newpost_button">
        글쓰기
      </div>
    </Link>
  )
}


export default App;
