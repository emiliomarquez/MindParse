import React, {useContext} from "react";
import { Redirect } from "react-router-dom";
import {AuthContext} from "../auth/Auth";
import db , { provider2 } from "../base"
//import '../App.css';
import "../styles/Login.css"

const Login = ({history}) => {

    const handleLogin = (event) => {

        event.preventDefault();
        const { email, password } = event.target.elements;

        try{
            
            db
                .auth()
                .signInWithEmailAndPassword(email.value, password.value)
            history.push("/");
            
        } catch(error){
            alert(error);
        }
    }

    const googleSignIn = () => {
        db.auth().signInWithPopup(provider2).then(function(result){
            console.log(result);
            console.log("Success! Google Account has been linked.");

            var userGoogleEmail = result.additionalUserInfo.profile.email;
            var userGoogleName = userGoogleEmail.substring(0, userGoogleEmail.lastIndexOf("@"));
            
            const user = db.auth().currentUser;
            const userUid = user.uid;
            const userInfo = {
                userName: userGoogleName,
                userEmail: userGoogleEmail
            }

            db.database().ref(`users/${userUid}`).update({userInfo});
            history.push("/");
        }).catch(function(err){
            console.log(err);
            console.log("Failure! Unable to link Google Account.");
        })
    }


    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to="/" />;
    }

    const redirectSignUp = () => {
        history.push("/signup")
    }

    const forgotPassword = () => {
        history.push("/forgot")
    }
    
    return(
    <div className = "root2" style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}>
        <div id = "logindiv" className="centered">
            <link rel="stylesheet" href="https://use.typekit.net/irw6qvs.css"></link>
            <h2 className = "h1log">Log In</h2>
            <p className = "infotext">Please enter your information <br />below in order to log in</p>
                <form onSubmit={handleLogin} >
                    <label>
                        <p>Email</p> 
                        <input className = "logininput" name="email" type="email" placeholder="Email" />
                    </label>
                    <br />
                    <label>
                        <p>Password </p>
                        <input className = "logininput" name="password" type="password" placeholder="Password" />
                    </label>
                    <br />
                    <button className="logButton" type="submit">Log In</button>
                    <button className="gButton" onClick={googleSignIn}>Log In with Google</button>
                </form>

                {/* <button onClick={redirectSignUp}>Sign Up</button> */}
                

                <button id = "sign" className= "logButton" onClick={redirectSignUp}>Sign Up Instead</button>
                <button id = "forgot" className= "forgotButton" onClick={forgotPassword}>Forgot password?</button>
        </div>
       </div>
    );
};

export default Login;