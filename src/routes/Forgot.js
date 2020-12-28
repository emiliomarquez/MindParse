import React, {useContext} from "react";
import { Redirect } from "react-router-dom";
import {AuthContext} from "../auth/Auth";
import db , { provider2 } from "../base"
import "../styles/Forgot.css"

const Forgot = ({history}) => {

    const handleForgot = (event) => {

        event.preventDefault();
        const { email } = event.target.elements;

        try{
            db
                .auth()
                .sendPasswordResetEmail(email.value)
            alert("An email has been sent to you. Please check your email.");
            history.push("/");
        } catch(error){
            alert(error);
        }
    }

    return(
        <div className ="topforgot">
        <div className="centered">
            <h1 className="h1log" >Forgot password</h1>
            <form onSubmit={handleForgot} >
                <label>
                    Email
                    <input className="forgotinput" name="email" type="email" placeholder="Recovery Email" />
                </label>
                <br />

                <button className="logButton" type="submit">Confirm Account Recovery</button>
            </form>
            </div>
        </div>
    );
};

export default Forgot;