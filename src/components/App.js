import React,{useEffect, useState} from 'react';
import "./App.css";
import Post from "./Post.js";
import {db,auth} from "./firebase.js";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import ImageUpload from "./ImageUpload";



function App() {
  const [posts,setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [user,setUser] = useState(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
  useEffect(()=>{
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
      id:doc.id,
      post:doc.data()
      })
      ));
    })
 

  },[posts]);


  useEffect(()=>{
  const unsubscribe = auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      console.log(authUser);
      setUser(authUser);
    }else{
      setUser(null);
    }
   })

   return()=>{
    unsubscribe();
   }
  },[user,userName])


  function handleSubmit(event){
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      setOpen(false);
     
      setPassword("");
      setEmail("");
     return  authUser.user.updateProfile({
        displayName:userName
      })
    })
    .catch((error)=>alert(error.message))
    setUserName("");
  }
function handleSignInSubmit(event){
  event.preventDefault();
  auth.signInWithEmailAndPassword(email,password)
  .catch((error)=>alert(error.message));
  setOpenSignIn(false);
   setUserName("");
   setPassword("");
}

  return (
    <div className='app'>
    <Modal
        open={open}
        onClose={()=>{
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box className="sign__box" sx={style}>
          <div className='image__align'>
         <img className = "app__header__image" src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" alt="Instagram_Image" />
         </div>
         <form onSubmit={handleSubmit}>
         <div className="app__signup">
         <Input placeholder="userName" type="text" value={userName} onChange={(e)=> setUserName(e.target.value)} />
         <Input placeholder="email" type="text" value={email} onChange={(e)=> setEmail(e.target.value)} />
         <Input placeholder="password" type="text" value={password} onChange={(e)=> setPassword(e.target.value)} />
        <button className="sign__button" type="submit">Sign Up</button>
        </div>
        </form>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>{
          setOpenSignIn(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
     
         <Box  className="sign__box" sx={style}>
         <div className='image__align'>
         <img className = "app__header__image__second" src=" https://cdn.icon-icons.com/icons2/2699/PNG/512/instagram_logo_icon_170643.png" alt="Instagram_Image" />
         </div>
         <form onSubmit={handleSignInSubmit}>
         <div className="app__signup">
         <Input placeholder="email" type="text" value={email} onChange={(e)=> setEmail(e.target.value)} />
         <Input placeholder="password" type="text" value={password} onChange={(e)=> setPassword(e.target.value)} />
        <button className="sign__button" type="submit">Sign In</button>
        </div>
         </form>

        </Box>
      </Modal>
      

    <div className="app__Header">
        <img className = "app__header__image" src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" alt="Instagram_Image" />
        <div>
        {user?(<Button onClick={()=>{auth.signOut()}}>Log Out</Button>):(<Button onClick={()=>{setOpen(true);}}>Sign Up</Button>)}
      <Button onClick={()=>{setOpenSignIn(true);}}>Sign In</Button>
      </div>
    </div>
    <div className="app__posts">
    {
      posts.map(({id,post})=>(
        <Post  key={id} postId={id} user={user} userName={post.userName} caption={post.caption} imageUrl ={post.imageUrl}/>
      ))
    }
    </div>
    {user?.displayName?( <ImageUpload userName={user.displayName}/>):<div className='sorry__message__container'><h3 className='sorry__message'>Sorry, U have to login to upload</h3></div>}
    </div>
  )
}

export default App;