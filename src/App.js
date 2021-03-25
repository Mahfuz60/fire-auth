import "./App.css";
import  firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import firebaseConfig from "./firebase-config";

// if (!firebase.apps.length){
  // firebase.initializeApp(firebaseConfig);}

  !firebase.apps.length && firebase.initializeApp(firebaseConfig);
  

function App() {

  const[user,setUser]=useState({
    isSignIn:false,
    name:'',
    email:'',
    password:'',
    photo:'',
    success:false
  });

  const [newUser,setNewUser]=useState(false);

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleClick=()=>{
    // console.log('clicked');

    firebase.auth().signInWithPopup(googleProvider)
    .then(response=>{
      const {displayName,email,photoURL}=response.user;
      
      const signedInUser={
        isSignIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedInUser);
      console.log(displayName,email,photoURL);
    })
    .catch(error=>{
      console.log(error);
      console.log(error.message);
    })
  }


    const handleSignOut=()=>{
      {
        firebase.auth().signOut()
        .then(response=>{
        const signedOutUser={
            isSignIn:false,
            name:'',
            email:'',
            photo:'',
            error:''
           
         }
         setUser(signedOutUser);
         console.log(response);

        })
        .catch(error=>{
          console.log(error.message);
        })
      }
    }


    const buttonStyle= {
      width:'200px',
      height:'50px',
      backgroundColor:'tomato',
      textAlign:'center',
      color:'white',
      fontSize:'18px',
      marginTop:'30px'
    }

    // form control

    const handleChange=(event)=>{
      //  console.log(event.target.name,event.target.value);
        let isFieldValid=true;
        if(event.target.name==='email'){
        isFieldValid=/\S+@\S+\.\S+/.test(event.target.value);
        // console.log(isFormValid);
       }
         else if(event.target.name=='password'){

        const isPasswordValid=event.target.value.length>=(6);
        const passwordHashNumber=/\d{1}/.test(event.target.value);
        isFieldValid=(isPasswordValid && passwordHashNumber);
      }

      if(isFieldValid){
        let newUserInfo={...user};
        newUserInfo[event.target.name]=event.target.value;
        setUser(newUserInfo);
      }

      }
      
      const handleSubmit=(event)=>{
        // console.log(user);
        if(newUser && user.email && user.password){
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((response) => {
          const newUserInfo={...user};
          newUserInfo.error='';
          newUserInfo.success=true;
          setUser(newUserInfo);
          updateUserInfo(user.name)
          // console.log(response);
         })
       .catch((error) => {
        const newUserInfo={...user};
        newUserInfo.error=error.message;
        newUserInfo.success=false;
        setUser(newUserInfo);
        // const  errorCode = error.code;
        //  const  errorMessage = error.message;
        // console.log(errorCode,errorMessage);
      });
        }
        else if(!newUser && user.email && user.password){
          firebase.auth().signInWithEmailAndPassword(user.email, user.password)
         .then((response) => {
          const newUserInfo={...user};
          newUserInfo.error='';
          newUserInfo.success=true;
          setUser(newUserInfo);
          console.log('update username info',response.user)
         


       
    })
    .catch((error) => {
      const newUserInfo={...user};
      newUserInfo.error=error.message;
      newUserInfo.success=false;
      setUser(newUserInfo);
  });
        }

        event.preventDefault();


      }


      const updateUserInfo =name=>{
        const user = firebase.auth().currentUser;

        user.updateProfile({
          displayName:name
          
        }).then(function() {
          console.log('user profile update successfully')
        })
        .catch(function(error) {
          console.log(error)
          
        });
      }


      const handleFbSIgnIn=()=>{
        firebase.auth().signInWithPopup(fbProvider)
        .then((result) => {
          const user = result.user;
          console.log('Fb SignIn',user);
        })
        .catch((error) => {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode,errorMessage)

          
        });
      
      }
      const fbStyle={
      width:'200px',
      height:'50px',
      backgroundColor:'blue',
      textAlign:'center',
      color:'white',
      fontSize:'18px',
      marginTop:'30px'


      }



  return (
    <div style={{textAlign:'center'}} >
     {
        user.isSignIn?<button onClick={handleSignOut} style={buttonStyle}>Google Sign Out</button>
        :<button onClick={handleClick} style={buttonStyle}>Google Sign in</button>
        
      }
      <br/>

      <button onClick={handleFbSIgnIn} style={fbStyle}>Sign In FaceBook</button>

      {
        user.isSignIn &&<div>
        <h3>wellCome,{user.name}</h3>
        <h3>Your Email:{user.email}</h3>
        <img src={user.photo} alt=""></img>
        
        </div>
       


      }
      
        

      <div>
        <form onSubmit={handleSubmit}>
          <h1>Our Own Authentication</h1>
          <input type="checkbox" name="SignUP" id="" onChange={()=>{setNewUser(!newUser)}}/>
          <label htmlFor="signUp">SignUp New User</label>
          <br/>
          {
            newUser && <input onBlur={handleChange} type="text" name="name" placeholder="Your Name" required/>
          }
          <br/>
          <input onBlur={handleChange} name="email" type="text"placeholder="Your Email address"  required />
          <br/> 
          <input  onBlur={handleChange} name="password" type="password"  placeholder="Your Password" required />
          <br/>
          <input style={{backgroundColor:'green',color:'white',width:'150px',height:'40px',fontSize:'18px',textAlign:'center',marginTop:'10px'}} onClick={handleSubmit} type="submit" value={newUser?'Sign Up':'Sign In'}/>

          <h4 style={{color:'red'}}>{user.error}</h4>
         {
           user.success &&  <h4 style={{color:'green'}}>User {newUser? 'SignUP':'Log In'}  Successfully Done</h4>
         }
          
        
        </form>

      
      
      </div>
    </div>
  );
}

export default App;
