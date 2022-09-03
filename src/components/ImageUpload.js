import React, {useState} from 'react';
import Button from '@mui/material/Button';
import {storage, db} from "./firebase.js";
import 'firebase/storage';
import firebase from 'firebase/compat/app';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import "./ImageUpload.css";
function ImageUpload({userName}) {
    const [caption,setCaption] = useState("");
    const [image,setImage] = useState(null);
    const [progress,setProgress]= useState(0);
    const [isUploaded, setIsUploaded] = useState(true);


    function handleChange(event){
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    }

    function handleUpload(){

          setIsUploaded(false);
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            alert(error.message);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                break;
        
              // ...
        
              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, 
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);

              db.collection("posts").add({
              timestamp:firebase.firestore.FieldValue.serverTimestamp(),
              caption:caption,
              imageUrl:downloadURL,
              userName:userName
              })
        
             setProgress(0);
             setCaption("");
             setImage(null);
            });
          }
        );
        setIsUploaded(true);



    }

  return (
    <div className='imageUpload'>
    {/* <progress className="imageupload__progress" value={progress} max="100" /> */}
    <input className="imageUpload__input" type="text" placeholder ="Enter a caption" value={caption} onChange={(event)=>{setCaption(event.target.value)}}/>
    <input type="file" onChange={handleChange} />
    {isUploaded?"":<span>`Uploading ${progress} %`</span>}
    <div className='imageUpload__button__align'>
    <button className="imageupload__button" onClick={handleUpload}>{isUploaded?"Upload":`Uploading ${progress} %`}</button>
    </div>
    </div>
  )
}

export default ImageUpload;
