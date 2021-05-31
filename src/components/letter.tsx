import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Post from './post';
import './Letter.css';
import letterInfo from '../resource/letterInfo';

function Letter(prop : letterInfo) {
    const [isPostOpen, setIsPostOpen] = useState(false);

    let letterStyle = {
        backgroundImage: `url(${prop.img[0]})`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `cover`,
        backgroundPosition: `center center`,
    }

    function openPost(){
        setIsPostOpen(!isPostOpen);
    }
    return (
        <div className="letter" style={letterStyle} onClick={openPost}>
            <div className="text-wrap">
                <div className="content">
                    {prop.title}
                </div>
                <div className="author">
                    Author -{prop.name}-
                </div>
            </div>
            {isPostOpen ? <Post name={prop.name} title={prop.title} write={prop.write} img={prop.img} toggle={openPost} /> : null}
        </div>
    )
}   

export default Letter;