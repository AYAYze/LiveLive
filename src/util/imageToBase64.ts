type a = string | void;

function imageToBase64(event : React.ChangeEvent<HTMLInputElement>) : a {

    let file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    // if(event.currentTarget.validity.valid) {
    //     let a = await mutateFunction({variables: { picture: file }})
    //     console.log(a.data.UploadImage);
    // }
    let reader = new FileReader();
    reader.onloadend = () => {
        const base64 = reader.result;
        

        if(base64) {
            return base64.toString();
        }
        else return '';
    }

    if(file) {
        reader.readAsDataURL(file);
    }
}  

export default imageToBase64;