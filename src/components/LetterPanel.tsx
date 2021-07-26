import React from 'react';
import './LetterPanel.css';
import LetterInfo from '../types/LetterInfo';

function LetterPanel(prop : LetterInfo) {

    let letterStyle = {
        backgroundImage: `url(${prop.thumb})`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `cover`,
        backgroundPosition: `center center`,
    }
    return (
        <div className="letter" style={letterStyle}>
            <div className="text-wrap">
                <div className="borderBox">
                </div>
                <div className="content">
                    {prop.title}
                </div>
                <div className="author">
                    Author -{prop.author}-
                </div>
            </div>

        </div>
    )
}   

export default LetterPanel;