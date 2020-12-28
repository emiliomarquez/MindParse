import React, {Component} from 'react';
import db from "../base";
import Popup from "reactjs-popup";
import {getDateWithTime} from '../assets/utils';
import 'reactjs-popup/dist/index.css';
import '../styles/TodoFrame.css';
import { Icon, List } from 'semantic-ui-react';
import setTodo from "../model/setTodo";
import removeTodo from "../model/removeTodo";


export default class Todo extends Component {
    constructor(props){
		super(props);
        this.handleMouseHover = this.handleMouseHover.bind(this);
		this.state = {
			todoName: props.todoName,		// Name of Todo
            date: props.date,				// Date the Todo was created
            completionDate: "",             // Date the Todo was completed
            isCompleted: props.isCompleted,             // Whether the Todo item is completed
            popupOpen: false,				// Whether the popup window should be open
            isHovering: false               // whether to show options
		};

		this.database = db.database().ref(`users/${db.auth().currentUser.uid}/todos/${props.date}`)
        this.editTodo = this.editTodo.bind(this);
        this.crossTodo = this.crossTodo.bind(this);

	};

	deleteTodo(){
		// Delete Todo from database maybe dont do this
        //this.database.remove();
        removeTodo(this.database);
    }
    
    crossTodo(){
        if(this.state.isCompleted) {
            this.setState({isCompleted: false});
            this.setState({completionDate: ''});
            const todoId = this.state.date;
            setTodo(this.database, this.state.todoName, todoId, '', false)
        } else {
            this.setState({isCompleted: true});
            this.setState({completionDate: `todo-${getDateWithTime()}`});
            const todoId = this.state.date;
            setTodo(this.database, this.state.todoName, todoId, `todo-${getDateWithTime()}`, true)
        }
        
    }

	editTodo(event){
        event.preventDefault();
		// Get info from form
		var { todoName} = event.target.elements; 
		
		const userId = db.auth().currentUser.uid;
        const todoId = this.state.date;
        
        if( todoName.value === '') {
            todoName.value = this.state.todoName;
        } else if(todoName.value.length < 1) {
			alert("The to-do item's name must be one character or greater.");
			document.getElementById('todoName').value=''; 
			return false;
        }
		
		// Add edited Todo to database
        setTodo(db.database().ref(`users/${userId}/todos/${todoId}`), todoName.value, todoId, 
                this.state.completionDate, this.state.isCompleted)
        
        this.setState({todoName: todoName.value});

		// Clear form after submission
        document.getElementById('todoName').value=''; 
        this.closePopup();
    }

	openPopup = () => {
    	this.setState({popupOpen: true})
    }

	closePopup = () => {
		this.setState({popupOpen: false})
    }

    handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

    // error with this li, invalid value for pop
    renderTodo() {
        if(this.state.isCompleted) {
            return(
                <List.Item className="todoItemChecked" onClick={this.openPopup}>
                    <Icon name="check" />
                    <List.Content>
                        <div className="truncateChecked">
                            <s>{this.state.todoName}</s>
                        </div>
                    </List.Content>
                </List.Item>
            )
        } else {
            return(
                <List.Item className="todoItem" onClick={this.openPopup}>
                    <List.Content className="truncate">
                            {this.state.todoName}
                    </List.Content>
                </List.Item>
            )
        }
    }

    renderCrossButton(){
        if(this.state.isCompleted){
            return(
                <button className="secondButton todoeditcancel" onClick={() => {
                    this.crossTodo(this.state);
                    this.closePopup();
                }}> Mark as Incomplete
                </button>
            )
        } else {
            return(
                <button className="secondButton todoeditcancel" onClick={() => {
                    this.crossTodo(this.state);
                    this.closePopup();
                }}> Mark as Complete
                </button>
            )
        }
    }

	render(){
        return (
            <div className="todoItemContainer" onClick={this.openPopup}>
                <List>
                    {this.renderTodo()}
                </List>
                <Popup open={this.state.popupOpen} onClose={this.closePopup} position={"right center"}>
                <button className="close"  onClick={this.closePopup}> &times; </button>
                    <div className="edittodocontent"> 
                    <h2 className="labelHabit">Edit To Do Item: {this.state.todoName}</h2>
                        <form className="edittodoform" onSubmit={this.editTodo}>
                            <br/>
                            <label className="habitL">To Do Item Name:</label>
                            <br />
                            <input className="formH"name='todoName' id='todoName' type='text' placeholder="Edit Name" />
                            <br /> 
                            <button className="secondButton" type="submit">Confirm Edit</button>
                        </form>
                        <div className= "edittodoactions">
                        {this.renderCrossButton()}
                        <br />
                        <button className="secondButton  todoeditcancel" onClick={() => { 
                             this.deleteTodo(this.state);
                            this.closePopup();
                        }}> Delete To Do Item
                        </button>
                        <br />
                        </div> 
                    </div> 
                </Popup>

            </div>
        );

    } 
}

