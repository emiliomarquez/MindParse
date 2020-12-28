/*global chrome*/
import "../styles/Statistics.css";

// Import Libraries
import React, {Component} from 'react';
import db, { provider2, auth } from "../base";

// Import Components
import TimerStats from '../view/TimerStats';
import HabitStats from '../view/HabitStats';
import MoodStats from "../view/MoodStats";

// Import Icons
import SignOutIcon from '../assets/logout.svg';
import UserIcon from '../assets/user.svg';
import DashIcon from '../assets/working.svg';
import {Link} from "react-router-dom";

import getTimerStat from "../model/getTimerStat";
import getHabits from "../model/getHabits";

export default class Statistics extends Component {
    constructor(props){
        super(props);

        let date = new Date();
        date = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        const time = new Date(date).getTime()

        this.state = {
            minTime: time,
            habitInfo: [],
            hNames: [],
            hValues: [],
            series: [
                {
                    name: "Completed",
                    data: []
                },
                {
                    name: "Stopped",
                    data: []
                }]
        }

    }


    componentDidMount() {
        const pastSeries = this.state.series;
        let pastMinTime = this.state.minTime;
        let pastHabitInfo = this.state.habitInfo;
        let pasthNames = this.state.hNames;
        let pasthValues = this.state.hValues;

        getHabits()
        .then(response => {
            for (let [key, value] of Object.entries(response)) {
                pastHabitInfo.push(value);
                pasthNames.push(value.habitName);
                pasthValues.push(value.habitValue);
            }

            this.setState({
                habitInfo: pastHabitInfo,
                hNames: pasthNames,
                hValues: pasthValues
            });

        });

        // Get a list of all habits associated with current user
        getTimerStat()
        .then(response => {
            for (let [key, value] of Object.entries(response)) {
                pastSeries[0].data.push({
                    x: key,
                    y: value.completed
                });
                pastSeries[1].data.push({
                    x: key,
                    y: value.stopped
                });
                pastMinTime = Math.min(pastMinTime, new Date(key).getTime())
            }

            pastSeries[0].data = pastSeries[0].data.sort((a, b) => new Date(b.x).getTime() - new Date(a.x).getTime())
            pastSeries[1].data = pastSeries[1].data.sort((a, b) => new Date(b.x).getTime() - new Date(a.x).getTime())

            for(let i=0; i < pastSeries[0].data.length - 1; i++) {
                let latestDate = pastSeries[0].data[i].x
                let tempDate = new Date(latestDate);
                tempDate.setDate(tempDate.getDate() - 1);
                let tempStr = (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + '-' + tempDate.getFullYear();

                let diff = new Date(pastSeries[0].data[i + 1].x).getTime() != tempDate.getTime()
                if (diff) {
                    pastSeries[0].data.splice(i+1, 0, {
                        x: tempStr,
                        y: 0
                    });
                    pastSeries[1].data.splice(i+1, 0, {
                        x: tempStr,
                        y: 0
                    });

                }
            }

            this.setState({
                series: pastSeries,
                minTime: pastMinTime
            });

        });

        //
        // this.databaseTimer.on('child_changed', snapshot => {
        //     for(let i=0; i < pastSeries[0].data.length; i++){
        //         if(pastSeries[0].data[i].x === snapshot.key){
        //             pastSeries[0].data[i].y = snapshot.val().completed;
        //             pastSeries[1].data[i].y = snapshot.val().stopped;
        //             break;
        //         }
        //     }
        //     this.setState({series: pastSeries});
        // });


    }


    componentWillUnmount() {
        this.databaseHabits.off();
    }

    render(){

        return (
            <div className="body">

                <link rel="stylesheet" href="https://use.typekit.net/irw6qvs.css"></link>
                <div className="welcome-stats">
                    <h1>Statistics</h1>
                    <h3>Which statistics do you want to see?</h3>

                    <nav className="nav statsnav">
                    <ul id="sidebar-nav">
                        {/* <h2>Temp user settings button</h2> */}
                        <li title="Home Page">
                            <Link to='/'>
                                <img src={DashIcon}/>
                            </Link>
                        </li>

                        <li title="User Page">
                            <Link to="/User">
                                <button type='button'>
                                    <img src={UserIcon}/>
                                </button>
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

                </div>



                <div className="content statscontent">
                    <div>
                        <h2>Habits Stats</h2>
                        <HabitStats className="button" habitInfo={this.state.habitInfo} hNames = {this.state.hNames} hValues = {this.state.hValues}/>
                    </div>
                    <div>
                        <h2>Mood Stats</h2>
                        <MoodStats />
                    </div>
                    <div>
                        <h2>Timer Stats</h2>
                        <TimerStats className="button" minTime={this.state.minTime} series={this.state.series}/>
                    </div>
                </div>

              
            </div>

        );
    }
}

const signOut = () => {
    db.auth().signOut();
    // chrome.runtime.sendMessage(chrome.runtime.id, {cmd: 'stop'});
}