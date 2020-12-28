import React, {Component, useState} from 'react';
import db,{auth} from "../base";
import {getCurrentDate} from "../assets/utils";
import '../styles/Mood.css';
import Attitude from '../assets/attitude.svg';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '../styles/react-calendar-heatmap.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ReactTooltip from 'react-tooltip';

var currDate = getCurrentDate(); //saves todays date


export default class MoodStats extends Component {
    // to capture values by the app
    constructor(props){
        super(props);

        this.state ={
            form1: 0, ////mood slider here?
            form2: '', //good things
            form3: '', //things you could have done better
            isMoodVisible: false,
            // for data
            moodList: [],
            goodThings: [],
            date: []


        };
        // user reference
        const userId =  db.auth().currentUser;
        this.firebaseRef = db.database().ref(`users/${userId.uid}/moodInfo`);
        // expands mood div
        this.toggleExpandedDiv = this.toggleExpandedDiv.bind(this);
    }
    //data collection files

    //function to expand
    toggleExpandedDiv(){
        this.setState({isMoodVisible: !this.state.isMoodVisible,});
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    componentDidMount(){
        this.getValue();
        //popup here and also heatmap

    }
    getValue= () =>{
        const userId = db.auth().currentUser.uid;
        const ref = db.database().ref(`users/${userId.uid}/moodInfo`);
        let dates=[];
        let moodVal=[];

        db.database().ref('users').child(userId).child('moodInfo').once('value')
            .then((data) => {
                let fetchedData = data.val()
                // console.log('Fetched Data', fetchedData)
                let goodT=[];
       if(fetchedData){

                var keys = Object.keys(fetchedData)
               
                keys.forEach(vals =>{
                    dates.push(vals) //the date
                    var moodNum = data.child(vals+"/form1").val();
                    var good_things = data.child(vals+"/form2").val();
                    var bad_things = data.child(vals+"/form3").val();
                    const setter = {'date':vals, 'count':moodNum};
                    const set = {'date':vals, 'good':good_things,'bad':bad_things}
                    moodVal.push(setter)
                    goodT.push(set)

                });
            }
                //need to set state for date
                this.setState({moodList:moodVal}); //set moodList
                this.setState({goodThings:goodT});


            })
    }

    pushToFirebase(event) {
        const {form1, form2,form3} = this.state;
        event.preventDefault();
        this.firebaseRef.child(currDate).set({form1, form2,form3});//this overwrites "todays entry"
    }
    //Function for slider changing
    onSliderChange = form1 => {
        this.setState(
            {
                form1
            },
            () => {
                console.log(this.state.form1);
            }
        );
    };

    //main function
    render(){
        return(
            <>
                <div>
                    <Popup
                        trigger={<button id="entries" onClick={this.getValue}> View Entries </button>}
                        position="right center">
                        <div id="mood-table-container">
                            <h1 id="table.header">Your Mood Entries Over Time</h1>
                            <table>
                                <thead>

                                    <th>Dates</th>
                                    <th>Good Things</th>
                                    <th>Bad Things</th>
                                </thead>
                                <tbody>
                                {this.state.goodThings.map(data=>{

                                    return(
                                        <tr>
                                            <td id= "table.font">{data.date}</td>
                                            <td id= "table.font">{data.good}</td>
                                            <td id= "table.font">{data.bad}</td>
                                        </tr>
                                    );
                                })}

                                </tbody>
                            </table>
                        </div>
                    </Popup>
                    <br/>
                    <Popup
                        trigger={<button id="stats" onClick={this.getValue}> View Statistics </button>}
                        position="right center"
                        nested
                    >
                        <div>
                            <CalendarHeatmap
                                startDate={'11-21-2020'} //change
                                endDate={this.state.date[this.state.date.length]} //change
                                showOutOfRangeDays = {true}
                                values={this.state.moodList}
                                classForValue={(value) => {
                                    if (!value) {
                                        return 'color-scale-0';
                                    }
                                    return `color-scale-${value.count}`;
                                }}
                                horizontal={true}
                                showWeekdayLabels={true}
                                showMonthLabels={true}
                                tooltipDataAttrs={value => {
                                    if (value.count) {
                                        return {'data-tip': `${value.date} has mood: ${value.count}`};
                                    }
                                    return {'data-tip': `Did not record mood`};
                                }}

                                // onMouseOver={
                                //     //value => {
                                //     if (value) {
                                //         //alert(`Clicked on value with count: 0`);
                                //         alert(`Clicked on value with count: ${value.count}`);
                                //     }
                                //     //alert(`Clicked on value with count: ${value.count}`);
                                // }}

                            />
                            <ReactTooltip />
                        </div>
                    </Popup>
                </div>
            </>
        );
    }
}

