import React, {Component} from 'react';
import db from "../base";
import Popup from "reactjs-popup";
import '../styles/Habit.css';
import '../styles/TodoFrame.css';
import {HuePicker} from "react-color";
import removeHabit from "../model/removeHabit"
import setHabit from '../model/setHabit';

// Import Icons
import EditIcon from '../assets/pencil.svg';


export default class Habit extends Component {
	constructor(props){
		super(props);

		this.state = {
			tempIsPinned: props.isPinned,
			tempColor: props.color,
			habitName: props.habitName,		// Name of habit
			habitValue: props.habitValue,	// Starts at 0 and maxes at habitGoal
			habitStreak: props.habitStreak,	// Number of consective days that habit is incremented
			habitGoal: props.habitGoal,		// End goal for habitValue
			date: props.date,				// Date the habit was created
			isPinned: props.isPinned,		// Whether the habit shows up on the dashboard main menu
			color: props.color,				// Color for the habit
			popupOpen: false				// Wther the popup window should be open
		};

		this.database = db.database().ref(`users/${db.auth().currentUser.uid}/habits/${props.date}`)
		this.editHabit = this.editHabit.bind(this);
	};

	deleteHabit(){
		// Delete habit from database
		if (window.confirm("Deleting this habit will permanently remove all history of this habit. Do you want to continue?")) {
			//this.database.remove();
			removeHabit(this.database);
		}
	}

	editHabit(event){
		event.preventDefault();
		// Get info from form
		var { habitName, habitGoal} = event.target.elements;

		const userId = db.auth().currentUser.uid;
		const habitId = this.state.date;

		if(habitName.value === '') {
			habitName.value = this.state.habitName;
		}

		if(habitGoal.value === ''){
			habitGoal.value = this.state.habitGoal;
		}else if(isNaN(parseInt(habitGoal.value))) {
			alert("The habitGoal must be a whole number.");
			document.getElementById('habitGoal').value='';
			return false;
		} else if(parseInt(habitGoal.value) <= 0) {
			alert("The habitGoal must be 1 or greater.");
			document.getElementById('habitGoal').value='';
			return false;
		} else if(parseInt(habitGoal.value) < this.state.habitValue) {
			alert("The new habit goal cannot be less then the current habit value.");
			document.getElementById('habitGoal').value='';
			return false;
		}

		if(this.props.getPinnedCount() === 8 && this.state.isPinned === false && this.state.tempIsPinned === true) {
			alert("You can only pin 8 habits at a time. Please unpin another habit first or uncheck the pin option.");
			return false;
		}

		// Set edited habit in database
		setHabit(db.database().ref(`users/${userId}/habits/${habitId}`), habitName.value, this.state.habitValue, habitGoal.value,
				 habitId, this.state.tempIsPinned, this.state.tempColor);

		// Update state of habit
		this.setState({habitName: habitName.value})
		this.setState({habitGoal: habitGoal.value})
		this.setState({isPinned: this.state.tempIsPinned})
		this.setState({color: this.state.tempColor})

		this.closePopup();
	}

	incrementHabit = () => {
		if (this.state.habitValue < this.state.habitGoal) {

			// code below will change progress bar values
			const oldHabitValue = this.state.habitValue;
			const newHabitValue = oldHabitValue+1;

			this.setState({habitValue: newHabitValue});

			// code below will add new incremented value to database
			const habitId = this.state.date;

			setHabit(this.database, this.state.habitName, newHabitValue, this.state.habitGoal,
				     habitId, this.state.isPinned, this.state.color);
		}

	}

	decrementHabit = () => {
		if (this.state.habitValue > 0) {

			// code below will change progress bar values
			const oldHabitValue = this.state.habitValue;
			const newHabitValue = oldHabitValue-1;

			this.setState({habitValue: newHabitValue});

			// code below will add new decremented value to database
			const habitId = this.state.date;

			setHabit(this.database, this.state.habitName, newHabitValue, this.state.habitGoal,
				habitId, this.state.isPinned, this.state.color);
		}
	}

	resetHabit = () => {
		if (this.state.habitValue != 0) {

			// code below will change progress bar values
			const newHabitValue = 0;

			this.setState({habitValue: newHabitValue});

			// code below will add new reset habit to database
			const habitId = this.state.date;

			setHabit(this.database, this.state.habitName, newHabitValue, this.state.habitGoal,
				habitId, this.state.isPinned, this.state.color);
		}
	}

	openPopup = () => {
		this.setState({
			popupOpen: true,
			tempColor: this.state.color,
			tempIsPinned: this.state.isPinned
		})
	}

	closePopup = () => {
		this.setState({popupOpen: false})
	}

	handleColor = (color) => {
		this.setState({tempColor: color.hex})
	}

	handlePin = () => {
		this.setState({
			tempIsPinned: !this.state.tempIsPinned
		})
	}

	progressFlow = () => {
		let percent = this.state.habitValue/this.state.habitGoal * 100;
		percent = percent + "%";

		return (
			<div id="colorBar" style={{"backgroundColor": this.state.color, "width": percent}}/>
		);
	}

	render(){
		const ProgressBar = () => {

			return (
				<div className="bar" >
					<label className="showName" id="habitName">{this.state.habitName}</label>
					<label className="showProgress" id="progress">{this.state.habitValue}/{this.state.habitGoal}</label>
					<img className="hide editbut" src={EditIcon} onClick={this.openPopup}/>
					<button className="hide plus" onClick={this.incrementHabit}>+</button>

					<div>{this.progressFlow()}</div>
				</div>
			);
		}

		return (
			<div className = "ultraBar">
				<Popup open={this.state.popupOpen} onClose={this.closePopup} position={"right center"}>
					<div className= "edithabitcontent">
						<button className="close" onClick={this.closePopup}>&times;</button>

						<div className="header">
							<h1 className="labelHabit">Edit Habit: {this.state.habitName} - {this.state.habitValue} / {this.state.habitGoal}</h1>
						</div>
						<br/>
						<div className="decAndRes">
							<button className="button" id="decrementHabit" onClick={this.decrementHabit}>-</button>
							<button className="button" id="resetHabit" onClick={this.resetHabit}>Reset</button>
						</div>

						<div className="editHabitForm">
						<form onSubmit={this.editHabit}>
							<br/>
							<label className="habitL">Habit Name </label>
							<br />
							<input className="formH formH2" name='habitName' id='habitName2' type='text' placeholder="Habit Name"  />
							<br /> <br />
							<label className="habitL formH2">Habit Goal </label>
							<br />
							<input className="formH formH2" name='habitGoal' id='habitGoal' type='text' placeholder="Habit Goal"/>
							<br /> <br />
							<div className ='pinnedDiv'>
								<label className="habitL">Pin Habit? </label>
								<input name='isPinned' id='isPinned' type='checkbox'
									   checked={!!this.state.tempIsPinned} onChange={this.handlePin}/>
								<br /> <br />
							</div>
							<label className="habitL">Choose a color:</label>
							<br />
							<HuePicker color={this.state.tempColor} onChange={this.handleColor}/>
							<br />

							<div className="confirmAndDelete">
								<button className="button" id="confirmEdit" type="submit"> Confirm Edit </button>
								<br />
								<button className="button" id="deleteHabit" onClick={() => {
									this.deleteHabit(this.state);
									this.closePopup();
								}} >Delete Habit</button>
							</div>

						</form>
						</div>
					</div>
				</Popup>


				<div className="habitBar">
					<ProgressBar/>
				</div>

			</div>
		);
	}
}