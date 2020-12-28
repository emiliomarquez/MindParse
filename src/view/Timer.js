/*global chrome*/
import "../styles/Timer.css";

// Import Libraries
import React, {Component} from 'react';
import {Progress} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

// Import Icons
import PauseIcon from '../assets/pause.svg'
import PlayIcon from '../assets/play.svg'

// Import Timer Model Functions
import getTimer from '../model/getTimer';
import updateTimer from "../model/updateTimer";

const workLength = 60*25;
const breakLength = 60*5;

export default class Timer extends Component{
    constructor(props) {
        super(props);

        this.state = {
            timeLeft: workLength,
            isActive: false,
            sessionType: 'work',
            popupOpen: false,
            completed: 0,
            stopped: 0,
        }

        this.toggle = this.toggle.bind(this);
        this.stop = this.stop.bind(this);
        this.handleTimer = this.handleTimer.bind(this);
        this.incrementSessions = this.incrementSessions.bind(this);

        const tempDate = new Date();
        this.date = (tempDate.getMonth() + 1) + '-' + tempDate.getDate()+ '-' + tempDate.getFullYear();
    }

    componentDidMount() {
        let oldCompleted = this.state.completed;
        let oldStopped = this.state.stopped;

        getTimer()
        .then(response => {
            if (response != null) {
                oldCompleted = response.completed;
                oldStopped = response.stopped;
            } else {
                oldCompleted = 0;
                oldStopped = 0;
            }

            this.setState({
                completed: oldCompleted,
                stopped: oldStopped
            });
        })

        // comment out later
        // chrome.runtime.onMessage.addListener(this.handleTimer);
        // chrome.runtime.sendMessage(chrome.runtime.id, {cmd: 'getState'});
        // this.createFakeData();
    }

    // createFakeData() {
    //     for (let i=0; i<500; i++) {
    //         let tempDate = new Date(this.time);
    //         tempDate.setDate(tempDate.getDate() - i);
    //         let datePath = (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + '-' + tempDate.getFullYear();
    //         // let timePath = new Date(datePath).getTime();
    //         let tempPath = db.database().ref(`users/${db.auth().currentUser.uid}/Timer/${datePath}`);
    //         console.log(datePath)
    //         let tempCompleted = Math.floor(Math.random() * 5) + 3;
    //         let tempStopped = Math.floor(Math.random() * 3) + 2;
    //
    //         tempPath.set({
    //             completed: tempCompleted,
    //             stopped: tempStopped,
    //         });
    //     }
    // }

    componentWillUnmount() {
        // chrome.runtime.onMessage.removeListener(this.handleTimer);
    }

    toggle = () => {
        console.log("toggle")
        // chrome.runtime.sendMessage(chrome.runtime.id, {cmd: 'toggle'});
    }

    stop = () => {
        console.log("stop")
        if (this.state.timeLeft !== workLength) {
            this.setState({stopped: this.state.stopped + 1})
            updateTimer(this.state.completed, this.state.stopped + 1)
            // chrome.runtime.sendMessage(chrome.runtime.id, {cmd: 'stop'});
        }
    }

    openPopup = () => {
        this.setState({popupOpen: true});
    };

    closePopup = () => {
        this.setState({popupOpen: false});
    };

    handleTimer(response) {
        if (response.cmd === "getState") {
            this.setState(response.value);

        } else if (response.cmd === "timerFinished") {
            this.incrementSessions();
        }
    }

    incrementSessions() {
        this.setState({completed: this.state.completed + 1})
        updateTimer(this.state.completed + 1, this.state.stopped);
    }

    padZero = (value) => {
        if (value < 10) {
            return "0" + value;
        }
        return value;
    }

    render() {

        const ProgressBar = () => {
            const minutes = Math.floor(this.state.timeLeft/60);
            const seconds = this.state.timeLeft - minutes*60;
            const minutesStr = this.padZero(minutes)
            const secondsStr = this.padZero(seconds)

            const length = this.state.sessionType === 'work' ? workLength : breakLength;
            const percent = 100*(length - this.state.timeLeft)/length;
            const sessionTitle = this.state.sessionType === 'work' ? 'Work' : "Break";
            const icon = this.state.isActive ? PauseIcon : PlayIcon;
            const color = this.state.sessionType === 'work' ? 'yellow' : 'pink';

            return (
                <div className="ProgressBar">
                    <h2 className="Session">{sessionTitle}</h2>
                    <h2 className="Time">{minutesStr}:{secondsStr}</h2>
                    <img className="Icon" src={icon} alt="start icon"/>
                    <Progress className="Bar" percent={percent} color={color}/>
                </div>
            );
        };


        const DashboardComponent = () => {
            return (
                <div className="DashboardComp" onClick={this.openPopup}>
                    <ProgressBar />
                </div>
            );
        };

        const PopupComponent = () => {
            const buttonTitle = this.state.isActive ? 'Pause' :
                this.state.timeLeft === workLength ? 'Start' : 'Resume';

            return (
                <Popup open={this.state.popupOpen}
                       onClose={this.closePopup} position={"right center"}
                       contentStyle={{height: "250px", width:"500px"}}
                >
                    <button className="close" onClick={this.closePopup}>
                        &times;
                    </button>
                    <div className="PopupComp">
                        <ProgressBar />
                        <button onClick={this.toggle}> {buttonTitle} </button>
                        <button onClick={this.stop}> Stop</button>
                        <div className="Stats">
                            <h3 className="Completed">Completed: {this.state.completed}</h3>
                            <h3 className="Stopped">Stopped: {this.state.stopped}</h3>
                        </div>
                    </div>
                </Popup>
            );
        };


        return (
            <div className= "WeirdTimerDiv">
                <DashboardComponent />
                <PopupComponent />
            </div>
        )
    }
}