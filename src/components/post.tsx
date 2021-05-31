import React from 'react';
import ReactDOM from 'react-dom';
import './post.css';
import postInfo from '../resource/postInfo';

function Post(prop : postInfo){

    let titleStyle = {
        backgroundImage: `url(${prop.img[0]})`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `cover`,
        backgroundPosition: `center center`,
        backgroundAttachment: `fixed`,
    }
    function close() {
        console.log('hi');
        prop.toggle();

    }
    return (
        <div className="post">
            <div className="closePost" onClick={close}>
                {`X`}
            </div>
            <div className="content">
                <div className="title" style={titleStyle}>
                    <div className="titleBack">
                        {prop.title}
                    </div>
                </div>
                <div className="write">
                    {prop.write}
                </div>
                
            </div>
        </div>
    )
}

export default Post;