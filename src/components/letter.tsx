import React from 'react';
import ReactDOM from 'react-dom';
import { Link, useParams } from 'react-router-dom';
import './Letter.css';
import LetterInfo from '../types/LetterInfo';
import { gql, useQuery } from '@apollo/client';
import WriteInfo from '../types/WriteInfo';
import ImageInfo from '../types/ImageInfo';


const LETTER = gql`
  query Letter($id: Float!) {
    Letter(id: $id) {
      title,
      thumb,
      author,
      writes {
          text,
          startX,
          startY,
          font
      }

      images {
          url,
          startX,
          startY,
          width,
          height,
      }
      
    }
  }
`




interface ParamType {
    id: string
  }

function Post(){
    const { id } = useParams<ParamType>();

    const { loading, error, data} = useQuery(LETTER, {
        variables: {
            id:parseInt(id)
        }
    });

    const letter : LetterInfo = data?.Letter ?? ({
        images:[],
        writes:[]
    });

    let titleStyle = {
        backgroundImage: `url(${letter.thumb})`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `cover`,
        backgroundPosition: `center center`,
        backgroundAttachment: `fixed`,
    }
    return (
        <div className="post">
            <Link to={`/`}>
                <div className="closePost">
                    {`X`}
                </div>
            </Link>
            <div className="content">
                <div className="title" style={titleStyle}>
                    <div className="titleBack">
                        {letter.title}
                    </div>
                </div>
                <div className="write">
                    {
                        letter.writes.map(value=>{
                            return (
                                <Write writeInfo={value}/>
                            )
                        })

                    }
                    {
                        letter.images.map(value=>{
                            return (
                                <Image imageInfo={value}/>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

function Write({writeInfo} : {writeInfo : WriteInfo}) {
    const style = {
        position: "absolute" as "absolute",
        left: `${writeInfo.startX}px`,
        top: `${writeInfo.startY}px`,
        font: writeInfo.font
    }
    return (
        <div style={style}>
            {writeInfo.text}
        </div>
    )
}

function Image({imageInfo} : {imageInfo : ImageInfo}) {
    const style = {
        position: "absolute" as "absolute",
        left: `${imageInfo.startX}px`,
        top: `${imageInfo.startY}px`,
        width: `${imageInfo.width}px`,
        height: `${imageInfo.height}px`,
    }
    const imgStyle = {
        maxWidth: "100%",
        maxHeight: "100%"
    }
    return (
        <div style={style}>
            <img style={imgStyle} src={imageInfo.url}></img>
        </div>
    )
}

export default Post;