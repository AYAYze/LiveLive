import React from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './NewPost.css'

function Post() {

    let [textMode, setTextMode] = useState(false);
    let [imageMode, setImageMode] = useState(false);

    function textModeToggle(){
        if(imageMode) setImageMode(!imageMode)
        setTextMode(!textMode);
    }
    function imageModeToggle(){
        if(textMode) setTextMode(!textMode);
        setImageMode(!imageMode)
    }

    function getClickPosition(event : React.MouseEvent) {
        if(textMode || imageMode) {
            console.log(textMode, imageMode);
            console.log('x : ' + event.nativeEvent.offsetX);
            console.log('y : ' + event.nativeEvent.offsetY);
        }
    }

    function followMouse(event : React.MouseEvent) {
        if(textMode || imageMode) {
            console.log(textMode, imageMode);
            console.log('x : ' + event.nativeEvent.offsetX);
            console.log('y : ' + event.nativeEvent.offsetY);
        }
    }

    return (
        <div className="newPost">
            <Link to={`/`}>
                <div className="closePost">
                    {`X`}
                </div>
            </Link>
            <div className="title_section">
                <div className="select_title">
                    사진을 고르라해
                </div>
                <input type="text" className="select_title_name"></input>
            </div>

            <div className="tools">
                <div className={textMode ? 'tool_hover' : 'tool'} onClick={textModeToggle} >
                    T
                </div>
                <div className={imageMode ? 'tool_hover' : 'tool'} onClick={imageModeToggle}>
                    I
                </div>
            </div>


            <div className="content_write" onMouseMove={e => followMouse(e)} onClick={e => getClickPosition(e)}>

            </div>

        </div>
    )
}

function TextBox() {

    return (
        <div className="textbox">

        </div>
    )
}

export default Post;