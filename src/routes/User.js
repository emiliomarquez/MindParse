/*global chrome*/
import "../styles/User.css";

import React, {Component} from 'react';
import db, { provider2, auth } from "../base";

// Import Icons
import SignOutIcon from '../assets/logout.svg';
import DashIcon from '../assets/working.svg';
import StatsIcon from '../assets/stats.svg';
import Popup from 'reactjs-popup';
import {Link} from "react-router-dom";


export default class User extends Component {
    constructor(props){
        super(props);

        this.state = {
            userName: ""
        }

        this.database = db.database().ref(`users/${db.auth().currentUser.uid}/userInfo`)
    }


    componentDidMount() {
        let pastUserName = this.state.userName;

        this.database.on('value', snapshot => {
            pastUserName = snapshot.val().userName;
            this.setState({userName: pastUserName})
        });

    }

    componentWillUnmount() {
        this.database.off();
    }

    changeUserName(event){
        event.preventDefault();
		// Get info from form
		const { userName } = event.target.elements; 
		

		// Username must be >= 1 character
		if(userName.value.length < 1) {
			alert("Your new username should be at least 1 character long.");
			document.getElementById('userName').value=''; 
			return false;
		} 
		
		// Add new username to database
		db.database().ref(`users/${db.auth().currentUser.uid}/userInfo`).update({userName: userName.value});

		// Clear form after submission
		document.getElementById('userName').value=''; 
    }

    render(){

        return (
            <div class="body">
                <div class="welcome-stats">
                    <h1>User Page</h1>
                    <h2>Hello, {this.state.userName}</h2>

                </div>

                <nav class="nav usernav">
                    <ul id="sidebar-nav">
                        {/* <h2>Temp user settings button</h2> */}
                        <li title="Home Page">
                            <Link to='/'>
                                <img src={DashIcon}/>
                            </Link>
                        </li>

                        <li title="Statistics Page">
                            <Link to="/Statistics">
                                <img src={StatsIcon}/>
                            </Link>
                        </li>

                        <li title="Sign Out" >
                            <button id="signout-but" style={{cursor:'pointer'}}
                                    onClick={() => signOut()} alt="signout button" >
                                <img src={SignOutIcon}/>
                            </button>
                        </li>

                    </ul>
                </nav>


                <div className="userdiv">
                    <Popup trigger={<button className="button userbutton"> Change Username </button>} modal nested>
						{close => (
  
						<div className="modal usermodal">
                        <button className="close" onClick={close}>&times;</button>
							<div className="header">
								<h1>Enter a New Username</h1>
							</div>
							<div className="content">
							
							<form onSubmit={this.changeUserName} >
								<br />
								<input name='userName' id='userName' className="usernamechange" type='text' />
                                <br /> <br />
                                <button className="changebutton" type="submit">Confirm Change</button>
							</form>
							</div>
							<div className="changeactions">
							<br />
							<button
								className="changecancelbutton"
								onClick={() => {
								console.log('modal closed ');
								close();
								}}
							>
								Cancel
							</button>
							</div>
						</div>
						)}
					</Popup>
                </div>



            </div>

        );
    }
}

const signOut = () => {
    db.auth().signOut();
    // chrome.runtime.sendMessage(chrome.runtime.id, {cmd: 'stop'});
}