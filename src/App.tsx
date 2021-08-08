import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Route, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import LetterPanel from './components/LetterPanel';
import Letter from './components/Letter';
import './App.css';
import LetterInfo from './types/LetterInfo';
import Post from './components/NewPost';
import { useEffect } from 'react';



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
  const [refreshInterval, setRefreshInterval] = useState(1000);
  let { loading, error, data, refetch } = useQuery(LETTERS);
  const letters: LetterInfo[] = data?.Letters ?? [];

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(()=> refetch() , refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

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
