/*global chrome*/
import "../styles/Dashboard.css";
import "../styles/nav.css";
import React, {Component, useEffect, useState} from 'react';
import db  from "../base";
import {Link} from 'react-router-dom';

// Import all components here
import Timer from '../view/Timer';
import Mood from '../view/Mood';
import HabitFrame from '../view/HabitFrame';
import TodoFrame from '../view/TodoFrame';
import Quote from '../view/Quote'

// Import Icons
import SignOutIcon from '../assets/logout.svg';
import UserIcon from '../assets/user.svg';
import StatsIcon from '../assets/stats.svg';

// Import Random Elements
import Greetings from '../assets/Greetings';

export const DateTime = () => {

    let [date, setDate] = useState(new Date());

    useEffect(() => {
        let timer = setInterval(() => setDate(new Date()), 1000)

        return function cleanup() {
            clearInterval(timer)
        }
    });

    return (
        <div className="dateTime">
            <div id="datePt1">{date.toDateString()}</div>
            <br/>
            <div id="datePt2">{date.toLocaleTimeString()}</div>
        </div>
    )
}

export default class Dashboard extends Component {
    constructor(props){
        super(props);
        var greeting = new Greetings().generateRandomGreeting();

        this.state = {
            greetingPt1: greeting[0],
            greetingPt2: greeting[1],
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

    render(){

        return (

            <div className="body">
                <link rel="stylesheet" href="https://use.typekit.net/irw6qvs.css"></link>
                
                <div className="welcome-dash">
                    <div className="greetingAndName">
                        <div className="div-greetingPt1">
                            <h1 id="greetingPt1"> {this.state.greetingPt1} </h1>
                        </div>
                        <div className="div-greetingPt2">
                            <h1 id="dashUsername"> {this.state.userName}</h1>
                            <h1 id="greetingPt2"> {this.state.greetingPt2}</h1>
                        </div>
                    </div>
                    <div className="dateTime">
                        <DateTime></DateTime>
                    </div>
                </div>

                <nav className="nav">
                    <ul id="sidebar-nav">
                        <li title="Statistics Page">
                            <Link to="/Statistics">
                                <button type="button">
                                    <img src={StatsIcon}/>
                                </button>
                            </Link>
                        </li>

                        <li title="User Page">
                                <Link to="/User">
                                    <button type='button'>
                                        <img src={UserIcon}/>
                                    </button>
                                </Link>
                        </li>
                        <li title="Record your mood here!">
                            <Mood/>
                        </li>
                        <li title="Sign Out">
                            <button id='signout-but' onClick={() => signOut()}
                                    alt="signout button" style={{cursor:'pointer'}}>
                                <img src={SignOutIcon}/>
                            </button>
                        </li>

                    </ul>
                </nav>

                <div className="content">
                    <div className="top-half">
                        <TodoFrame/>
                        <HabitFrame />
                    </div>
                    <div className="bottom-half">

                        <div className="Timer">
                            <Timer />
                        </div>
                        <div className="Quote">
                            <Quote />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const signOut = () => {
    // chrome.runtime.sendMessage(chrome.runtime.id, {cmd: 'stop'});
    db.auth().signOut();
}