import React, { useEffect,useState } from 'react';
import "./Post.css";
import Avatar from '@mui/material/Avatar';
import {db} from "./firebase.js";
import firebase from 'firebase/compat/app';

function Post({postId,imageUrl,caption,userName, user}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("")
  useEffect(()=>{

   
    if(postId){
   db
    .collection('posts')
    .doc(postId)
    .collection("comments")
    .orderBy("timestamp","desc")
    .onSnapshot(snapshot=>{
    setComments(snapshot.docs.map(doc=>doc.data()));
  })
}
// return ()=>{
//   unsubscribe();
// }
},[postId])

function postComment(event){
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      userName:user.displayName,
      timestamp:firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment("");
}

  return (
    <div className="post">
   <div className='post__header'>
    <Avatar className="post__avatar" alt={userName} src="ergreaj"/>
    <h3>{userName}</h3>
    </div>
    
    {/* image */}
    <img className="post__Image" src={imageUrl} alt="Natural_Image" />
    {/* username + caption */}
    <h4 className="post__text"><strong className='post__strong'>{userName}</strong>{caption}</h4>
    <div className="post__comments">
    {
      comments.map((comment)=>{
        return (
        <p>
          <strong className='post__strong'>{comment.userName}</strong> {comment.text}
        </p>)
      })
    }
    </div>
    {user &&
      <form onSubmit={postComment}  className="post__commentBox">
    <input className="post__input"
    type="text"
    placeholder="Add a comment ..."
    value={comment}
    onChange={(e)=>setComment(e.target.value)}
    />
    <button 
    className="post__button"
    disabled={!comment}
    type="submit"
    >Post</button>
    </form>
    }
  
    
    </div>
  )
}

export default Post;