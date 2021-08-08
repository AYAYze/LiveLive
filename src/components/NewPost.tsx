import React from 'react';
import { useState, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import WriteInfo from '../types/WriteInfo';
import ImageInfo from '../types/ImageInfo';
import './NewPost.css'
import imageToBase64 from '../util/imageToBase64';
import { IMAGE_URI } from '../constant/constant';



const UPLOAD_IMAGE = gql`
    mutation UploadImage($picture: Upload!) {
        UploadImage(picture: $picture) 
    }
`;

const SUBMIT_LETTER = gql`
    mutation createLetter($letter: LetterInput!) {
        createLetter(letter: $letter) {
            author
            title
            thumb
            images {
            url
            startX
            startY
            width
            height
        }
            writes {
            startX
            startY
            font
            text
        }
            
    }
    }
`


const NewPost = React.memo(() => {
    const [mutateFunction] = useMutation(UPLOAD_IMAGE);
    const [addLetter, {data, loading, error }] = useMutation(SUBMIT_LETTER);

    let history = useHistory();

    const titleImageRef = useRef<HTMLInputElement>(null);

    let [textMode, setTextMode] = useState(false);
    let [imageMode, setImageMode] = useState(false);
    let [textInputMode, setTextInputMode] = useState(false);
    let [imageInputMode, setImageInputMode] = useState(false);
    //output
    let [author, setAuthor] = useState(''); //Clear
    let [title, setTitle] = useState('');  //Clear
    let [texts, setTexts] = useState<WriteInfo[]>([]);  //Clear
    let [images, setImages] = useState<ImageInfo[]>([]);
    let [titleImageResult, setTitleImageResult] = useState(""); //Clear

    //Image Title


    let imagePreviewStyle = {
        backgroundImage: `url(${titleImageResult})`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `cover`,
        backgroundPosition: `center center`
    }
    
    async function imageFileUploaded(event : React.ChangeEvent<HTMLInputElement>) {
        let file = event.currentTarget.files ? event.currentTarget.files[0] : null;

        let reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            if(base64) setTitleImageResult(base64.toString());
        }

        if(file) {
            reader.readAsDataURL(file);
        }
    }   
    //Text Image, Write Thing
    let NewPostRef = useRef<HTMLDivElement>(null);

    function textModeToggle(){
        if(imageMode) setImageMode(!imageMode)
        if(textInputMode) setTextInputMode(!textInputMode)
        if(imageInputMode) setImageInputMode(!imageInputMode)
        setTextMode(!textMode);
    }

    function imageModeToggle(){
        if(textMode) setTextMode(!textMode);
        if(imageInputMode) setImageInputMode(!imageInputMode)
        if(textInputMode) setTextInputMode(!textInputMode)
        setImageMode(!imageMode)
    }

    function getClickPosition(event : React.MouseEvent) {
        if(textMode) {
            setTextMode(!textMode);
            setTextInputMode(!textInputMode);
        }else if(imageMode) {
            setImageMode(!imageMode);
            setImageInputMode(!imageInputMode);
        }
    }


    let [followMouseTop, setFollowMouseTop] = useState(0);
    let [followMouseLeft, setFollowMouseLeft] = useState(0);

    function followMouse(event : React.MouseEvent) {
        if(textMode || imageMode) {
            if(NewPostRef.current) {
                setFollowMouseTop(event.clientY - NewPostRef.current.getBoundingClientRect().top);
                setFollowMouseLeft(event.clientX - NewPostRef.current.getBoundingClientRect().left);
            }
        }
    }

    function addText(data : WriteInfo){
        setTextInputMode(!textInputMode);
        setTexts(oldArr => [...oldArr, {text: data.text, startX: data.startX, startY:data.startY, font:data.font}])
    }

    function addImage(data : ImageInfo) {
        setImageInputMode(!imageInputMode);
        setImages(oldArr => [...oldArr, {url: data.url, startX: data.startX, startY: data.startY, width: data.width, height: data.height}]);
    }



    async function submit() {
        //이미지 업로드 만들기 및 주소 얻기
        let file = titleImageRef.current?.files ? titleImageRef.current?.files[0] : null;
        let titleImageLink;
        if(titleImageRef.current?.validity.valid && file)
            titleImageLink = (await mutateFunction({variables: { picture: file}}))?.data.UploadImage;
        


        //전부 업로드
        console.log(titleImageLink);
        console.log(title);
        console.log(texts);
        console.log(author);
        console.log(images);
        if(title && author)
            await addLetter({
                variables: {
                    letter : {
                        author:author,
                        title: title,
                        thumb: titleImageLink ? `${IMAGE_URI}${titleImageLink}` : '',
                        images:images,
                        writes: texts
                    }
                }
            }).then(()=>{
                history.replace("/");
                window.location.reload();
            });
        else {
            alert("제목과 이름은 무조건 적어주세요!");
            console.log("error");
        }


    }

    return (
        <div className="newPost">
            <Link to={`/`}>
                <div className="closePost">
                    {`X`}
                </div>
            </Link>
            <div className="title_section" style={imagePreviewStyle}>

                <div className="select_title_img">
                    <label htmlFor="select_img" className="select_title" >
                        <div className="select_title">
                            [ 타이틀 이미지 선택 ]
                        </div>
                    </label>

                    <input type="file" name="select_img" id="select_img" accept=".png, .jpg, .jpeg, .gif" onChange={e => imageFileUploaded(e)} ref={titleImageRef}></input>
                </div>

                <input type="text" className="select_title_name" onChange={e => setTitle(e.target.value)} placeholder="Title"></input>
                <input type="text" className="select_author" onChange={e => setAuthor(e.target.value)} placeholder="Author"></input>
            </div>

            <div className="tools">
                <div className={textMode ? 'tool_hover' : 'tool'} onClick={textModeToggle} >
                    T
                </div>
                <div className={imageMode ? 'tool_hover' : 'tool'} onClick={imageModeToggle}>
                    I
                </div>
            </div>

            
            <div className="content_write" onMouseMove={e => followMouse(e)} onClick={e => getClickPosition(e)} ref={NewPostRef}>
                {
                    texts.map((textData,index)=> {
                        return (
                            <TextBox key={index} textInfo={textData}></TextBox>
                        )
                    })
                }
                {
                    images.map((imageData,index)=> {
                        return (
                            <ImageBox key={index} imageInfo={imageData}></ImageBox>
                        )
                    })
                }

                
                {textMode || textInputMode ? <TextBoxPlaceholder top={followMouseTop} left={followMouseLeft} move={followMouse} set={addText}></TextBoxPlaceholder> : null}
                {imageMode || imageInputMode ? <ImageBoxPlaceholder top={followMouseTop} left={followMouseLeft} move={followMouse} set={addImage}></ImageBoxPlaceholder> : null}
            </div>
            
            <div className="postSubmit" onClick={submit}>글쓰기</div>
        </div>
    )
});






const TextBox = React.memo(function TextBox({textInfo} : {textInfo: WriteInfo}) {

    let boxStyle = {
        top: `${textInfo.startY}px`,
        left: `${textInfo.startX}px`,
        font: textInfo.font
    }    
    
    return (
        <div className="textbox" style={boxStyle}>
            <div>{textInfo.text}</div>
        </div>
    )
});

const ImageBox = React.memo(function ImageBox({imageInfo} : {imageInfo : ImageInfo}) {

    let imageStyle = {
        backgroundImage: `url(${imageInfo.url})`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `cover`,
        backgroundPosition: `center center`,
        width: `${imageInfo.width}px`,
        height: `${imageInfo.height}px`,
        top: `${imageInfo.startY}px`,
        left: `${imageInfo.startX}px`
    }

    return (
        <div className="imagebox" style={imageStyle}>
        </div>
    );


});


const TextBoxPlaceholder = React.memo(function TextBoxPlaceholder({top, left, move, set} : {top: number, left: number, move: (event:React.MouseEvent)=>void, set:(data:WriteInfo)=>void}) {

    let inputRef = useRef<HTMLInputElement>(null);

    let followMouseStyle = {
        top: `${top}px`,
        left: `${left}px`
    }    
    
    return (
        <div className="textboxPlaceholder" style={followMouseStyle} onMouseMove={e => {e.stopPropagation(); move(e)}}>
            <input type="text" ref={inputRef}></input>
            <button onClick={()=> set({text:inputRef.current ? inputRef.current.value : '', startX:left, startY:top, font:''})}>저장</button>
        </div>
    )
});

const ImageBoxPlaceholder = React.memo(function ImageBoxPlaceholder({top, left, move, set} : {top: number, left: number, move: (event:React.MouseEvent)=>void, set:(data:ImageInfo)=>void}) {
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
            {selectImageMode ? 

                <div className="selectImagePopup" onClick={()=>setSelectImageMode(!selectImageMode)}>
                    <div className="imageMethodWrap" onClick={(e)=>e.stopPropagation()}>
                        <div className="imageMethod" onClick={()=>setUrlMode(true)}>URL로 가져오기</div>
                        <div className="imageMethod" onClick={()=>setUrlMode(false)}>컴퓨터에서 가져오기</div>
                    </div>
                    <div onClick={(e)=>e.stopPropagation()}>
                        {
                            urlMode ? 
                                <div className="ByUrl">
                                    <input placeholder="이미지 주소" ref={urlInputRef}></input>
                                    <input type="button" value="확인" onClick={()=>{set({url: urlInputRef.current ? urlInputRef.current.value : '', startX:left, startY: top, width: 100, height:100}); }}></input>
                                </div>
                                :
                                <div className="ByDesktop">
                                    <label htmlFor="getImageFromDesktop"> 컴퓨터에서 가져오기 </label>
                                    <input type="file" id="getImageFromDesktop" accept=".png, .jpg, .jpeg, .gif" onChange={(e)=>{ImageByDesktopChange(e)}}></input>
                                </div>

                        }
                    </div>
                </div> 
                
            : null}
        </div>
    )
});

export default NewPost;