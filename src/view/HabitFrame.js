import React, {Component} from 'react';
import db from "../base";
import Habit from './Habit';
import {getDateWithTime} from '../assets/utils';
import '../styles/HabitFrame.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {HuePicker} from "react-color";
import setHabit from '../model/setHabit';
import getHabit from '../model/getHabit';


// Will hold and render the individual habit components

export default class HabitFrame extends Component {
    constructor(props){
		super(props);
		
		this.state = {
			addPopupOpen: false,
			allHabitsPopupOpen: false,

			tempIsPinned: false,
			tempColor: "cyan",
			habits: [],			// List of all habits
		};

		this.database = db.database().ref(`users/${db.auth().currentUser.uid}/habits`)
		this.addHabit = this.addHabit.bind(this);
		this.getPinnedCount = this.getPinnedCount.bind(this);
	}

	componentDidMount() {
		let pastHabits = this.state.habits;

		// Get a list of all habits associated with current user
		pastHabits = getHabit(this.database, pastHabits)
		this.setState({habits: pastHabits})
		/*this.database.on('child_added', snapshot => {
			console.log("child_added")
			pastHabits.push(snapshot.val())
			this.setState({habits: pastHabits})
		});


		this.database.on('child_removed', snapshot => {
			console.log("child_removed")

			let i = 0;
			for(; i < pastHabits.length; i++){
				if(pastHabits[i].date === snapshot.key){
					console.log("i = " + i)
					break;
				}
			}

			pastHabits.splice(i, 1);

			this.setState({habits: pastHabits})
		})


		this.database.on('child_changed', snapshot => {
			console.log("child_changed")
			for(let i=0; i < pastHabits.length; i++){
				if(pastHabits[i].date === snapshot.key){
					pastHabits[i] = snapshot.val();
					break;
				}
			}
			this.setState({habits: pastHabits})
		})*/
	}


	componentWillUnmount() {
        this.database.off();
    }

	handlePin = () => {
		this.setState({
			tempIsPinned: !this.state.tempIsPinned
		})
	}

	addHabit(event){
		event.preventDefault();
		// Get info from form
		const { habitName, habitGoal} = event.target.elements;
		const userId = db.auth().currentUser.uid;
		const habitId = `habit-${getDateWithTime()}`;

		// Habit must be integer >= 1
		if(isNaN(parseInt(habitGoal.value))) {
			alert("The habitGoal must be a whole number.");
			document.getElementById('habitGoal').value=''; 
			return false;
		} else if(parseInt(habitGoal.value) <= 0) {
			alert("The habitGoal must be 1 or greater.");
			document.getElementById('habitGoal').value='';
			return false;
		}

		// console.log("pin =" + this.state.tempIsPinned)
		// Checks if user is trying to pin more than 8 habits
		if(this.getPinnedCount() === 8 && this.state.tempIsPinned === true) {
			alert("You can only pin 8 habits at a time. Please unpin another habit first or uncheck the pin option.");
			return false;
		}
		
		// Add habit to database
		setHabit(db.database().ref(`users/${userId}/habits/${habitId}`), habitName.value, 0, habitGoal.value, habitId, 
				 this.state.tempIsPinned, this.state.tempColor);

		// Clear form after submission
		document.getElementById('habitName').value=''; 
		document.getElementById('habitGoal').value=''; 
		document.getElementById('isPinned').checked=false;

		this.closeAddPopup();
    }

	getPinnedCount() {
    	let count = 0;
    	console.log(this.state.habits)
    	for (let i=0; i<this.state.habits.length; i++) {
    		if (this.state.habits[i].isPinned) {
    			count = count + 1;
			}
		}
    	return count;
	}

	handleColor = (color) => {
		this.setState({tempColor: color.hex})
	}

	openAddPopup = () => {
		this.setState({
			addPopupOpen: true,
			tempColor: "cyan",
			tempIsPinned: false,
		})
	}

	closeAddPopup = () => {
		this.setState({
			addPopupOpen: false
		})
	}

	openAllHabitsPopup = () => {
		this.setState({
			allHabitsPopupOpen: true
		})
	}

	closeAllHabitsPopup = () => {
		this.setState({
			allHabitsPopupOpen: false
		})
	}


	render(){
    	const leftPinRecord = []
		const rightPinRecord = []
		const leftAllRecord = []
		const rightAllRecord = []
		let pinCount = 0;
		for (let i=0; i<this.state.habits.length; i++) {
			const habit = this.state.habits[i]
			const habitComp =
				<Habit
					habitName={habit.habitName}
					habitValue={habit.habitValue}
					habitStreak={habit.habitStreak}
					habitGoal={habit.habitGoal}
					date={habit.date}
					isPinned={habit.isPinned}
					key={habit.date}
					color={habit.color}
					incrementHabit={this.incrementHabit}
					getPinnedCount={this.getPinnedCount}
				/>

			if (i % 2 === 0) {
				leftAllRecord.push(habitComp)
			} else {
				rightAllRecord.push(habitComp)
			}

			if (habit.isPinned) {
				if (pinCount % 2 === 0) {
					leftPinRecord.push(habitComp)
				} else {
					rightPinRecord.push(habitComp)
				}
				pinCount = pinCount + 1;
			}
		}

    	return (
			<>
				<div className="habitFrame">
					<h2> Habits </h2>
					<div className='grid' >
						<div className='column'>
							{leftPinRecord}
						</div>
						<div className='column'>
							{rightPinRecord}
						</div>
					</div>

					<br />
					<div className="button-space">
						<button className="button flex" id="giantAddHabitButton" onClick={this.openAddPopup}> Add Habit </button>
						<button className="button flex" id="giantSeeAllHabitsButton" onClick={this.openAllHabitsPopup}> See All Habits </button>
					</div>
					<Popup open={this.state.addPopupOpen} onClose={this.closeAddPopup}
						   position={"right center"} modal nested
					>

						<div className="modal">
							<button className="close" onClick={this.closeAddPopup}> &times; </button>

							<div className="header">
								<h1 className="labelHabit">Add a New Habit</h1>
							</div>

							<div className="addcontent">
								<form onSubmit={this.addHabit} >
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
									<button className="button addbutton" type="submit">
										Add Habit
									</button>
								</form>
							</div>

							<div className="addactions">
								<button className="button addcancel" onClick={this.closeAddPopup}> Cancel </button>
							</div>
						</div>
					</Popup>

					<Popup open={this.state.allHabitsPopupOpen} onClose={this.closeAllHabitsPopup}
						   position={"right center"} modal nested
					>
						<div className="modal">
							<button className="close" onClick={this.closeAllHabitsPopup}> &times; </button>

							<div className="header">
								<h1>All Habits</h1>
							</div>

							<div className="content">
								<div className='grid' >
									<div className='column'>
										{leftAllRecord}
									</div>
									<div className='column'>
										{rightAllRecord}
									</div>
								</div>
							</div> 

							<div className="actions">
							<br />
							<button className="button allbutton" onClick={this.closeAllHabitsPopup}> Cancel </button>
							</div>
						</div>
					</Popup>
				</div>
			</>
		);
    }
}