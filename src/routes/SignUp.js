import React from "react";
import db, { provider2 } from "../base";
//import '../App.css';
import "../styles/SignUp.css"

const SignUp = ({history}) => {

    const handleSignUp = (event) => {

        event.preventDefault();
        const { displayName, email, password, passConfirm } = event.target.elements; 
       
        try{
            if (password.value === passConfirm.value) {
                db
                    .auth()
                    .createUserWithEmailAndPassword(email.value, password.value)
                    .then(function(user){
                        if(user) {
                            const user = db.auth().currentUser;
                            
                            const userUid = user.uid;
                            const userEmail = user.email;
                            const userName = displayName.value;
                            
                            const userInfo = {
                                userName: userName,
                                userEmail: userEmail
                            }
                            user.sendEmailVerification().then(function() {
                                // Email sent.
                                console.log("Verification Email has been sent.");
                                console.log(user.emailVerified);
                                //console.log(history.location.pathname);
                              }).catch(function(error) {
                                // An error happened.
                                console.log(error);
                              });

                            db.database().ref(`users/${userUid}`).set({userInfo});
                        }

                    });
   
                history.push("/");

                
                
            } else {
                alert("Passwords must match.")
            }
        } catch(error){
            alert(error);
        }
    }

    const redirectLogIn = () => {
        history.push("/")
    }

    return(
        <div class = "root2" style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}> 
        <div id = "logindiv" className="centered">
                <link rel="stylesheet" href="https://use.typekit.net/irw6qvs.css"></link>
                <h2 class = "h1log">Sign Up</h2>
                <p class = "infotext">Please enter your information <br />below in order to log in</p>
                <form onSubmit={handleSignUp} >
                    <label>
                        <p>Username</p>
                        <input class = "logininput" name="displayName" type="text" placeholder="Username" />
                    </label>
                    <br />
                    <label>
                       <p>Email</p> 
                        <input class = "logininput" name="email" type="email" placeholder="Email" />
                    </label>
                    <br />
                    <label>
                        <p>Password</p>
                        <input class = "logininput" name="password" type="password" placeholder="Password" />
                    </label>
                    <br />
                    <label>
                        <p>Confirm Password</p>
                        <input class = "logininput" name="passConfirm" type="password" placeholder="Confirm Password" />
                    </label>
                    <br />
                    <button id = "log" class = "logButton" type="submit">Sign Up</button>
                </form>
                <button id = "sign" class = "logButton" onClick={redirectLogIn}>Log In Instead</button>
        </div>
        </div>
    );
};

export default SignUp;