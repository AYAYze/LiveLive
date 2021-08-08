import React from 'react';
import { useState, useRef } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { IMAGE_URI } from '../constant/constant';
import ImageInfo from '../types/ImageInfo';
import './ImageBoxPlaceholder.css';

const UPLOAD_IMAGE = gql`
    mutation UploadImage($picture: Upload!) {
        UploadImage(picture: $picture) 
    }
`;

const ImageBoxPlaceholder = React.memo(function ImageBoxPlaceholder({top, left, move, set, imageMode} : {top: number, left: number, move: (event:React.MouseEvent)=>void, set:(data:ImageInfo)=>void, imageMode:boolean}) {
    const [mutateFunction] = useMutation(UPLOAD_IMAGE);

    let urlInputRef = useRef<HTMLInputElement>(null);

    let [selectImageMode, setSelectImageMode] = useState(false);
    let [urlMode, setUrlMode] = useState(true);


    let followMouseStyle = {
        top: `${top}px`,
        left: `${left}px`
    }

    async function ImageByDesktopChange(event : React.ChangeEvent<HTMLInputElement>) {
        let file = event.currentTarget.files ? event.currentTarget.files[0] : null;
        let imageLink;
        if(event.currentTarget?.validity.valid && file) 
            imageLink = (await mutateFunction({variables: { picture: file}}))?.data.UploadImage;

        set({
            url: imageLink ? `${IMAGE_URI}${imageLink}` : '',
            startX:left, 
            startY: top, 
            width: 100, 
            height:100
        });

    }


    return (
        <div className="imageboxPlaceholder" style={followMouseStyle} onMouseMove={e => {e.stopPropagation(); move(e)}}>
            <div onClick={()=> setSelectImageMode(!selectImageMode)}>Select Image</div>
            {selectImageMode && !imageMode ? 

                <div className="selectImagePopup" onClick={()=>setSelectImageMode(!selectImageMode)}>
                    <div className="imageMethodWrap" onClick={(e)=>e.stopPropagation()}>
                        <div className="imageMethod" onClick={()=>setUrlMode(true)}>URL로 가져오기</div>
                        <div className="imageMethod" onClick={()=>setUrlMode(false)}>컴퓨터에서 가져오기</div>
                    </div>
                    <div onClick={(e)=>e.stopPropagation()} className="methodWrap">
                        {
                            urlMode ? 
                                <div className="ByUrl">
                                    <input type="text" placeholder="이미지 주소" ref={urlInputRef}></input>
                                    <input type="button" value="확인" onClick={()=>{set({url: urlInputRef.current ? urlInputRef.current.value : '', startX:left, startY: top, width: 100, height:100}); }}></input>
                                    
                                </div>
                                :
                                <div className="ByDesktop">
                                    <label htmlFor="getImageFromDesktop"> 컴퓨터에서 가져오기 </label>
                                    <input type="file" id="getImageFromDesktop" accept=".png, .jpg, .jpeg, .gif" onChange={(e)=>{ImageByDesktopChange(e)}}></input>
                                </div>
                        }
                    </div>
                    <div className="closePopup">
                        Close
                    </div>
                </div> 
                
            : null}
        </div>
    )
});

export default ImageBoxPlaceholder;