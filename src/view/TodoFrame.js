import React, {Component} from 'react';
import db from "../base";
import Todo from './Todo';
import {getDateWithTime} from '../assets/utils';
import '../styles/TodoFrame.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import setTodo from '../model/setTodo'
import removeTodo from '../model/removeTodo'
import getTodo from '../model/getTodo';

// Will hold and render the individual Todo components

export default class TodoFrame extends Component {
    constructor(props){
		super(props);
		
		this.state = {
			todoCount: 0, 		// Count of total number of todos
			todos: [],			// List of all todos
			showModal: false,
			deleteAll: false,
		};

		this.database = db.database().ref(`users/${db.auth().currentUser.uid}/todos`)
		this.addTodo = this.addTodo.bind(this);
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
  	this.deleteAll = this.deleteAll.bind(this);
	}
	handleDelete(){
		const pastTodoCount = this.state.todoCount;
		if(pastTodoCount <= 0){
			alert("Nothing to delete!");
		}
		else{

			this.setState({deleteAll: true})
			this.deleteAll(true)
		}
	}
	handleOpenModal () {
		this.setState({ showModal: true });
	}

	handleCloseModal () {
		this.setState({ showModal: false });
	}

	componentDidMount() {
		let pastTodoCount = this.state.todoCount;
		let pastTodos = this.state.todos;
		
		// Get a list of all Todos associated with current user
		let funcReturn = getTodo(this.database, pastTodos, pastTodoCount);
		pastTodos = funcReturn[0];
		pastTodoCount = funcReturn[1];
		this.setState({todos:pastTodos});
		this.setState({todoCount:pastTodoCount})
		/*this.database.on('child_added', snapshot => {
			pastTodos.push(snapshot.val());
				this.setState({todos: pastTodos});
				this.setState({todoCount: snapshot.numChildren()})
			});


		this.database.on('child_removed', snapshot => {
			console.log("child_removed")
			let i = 0;
			for(; i < pastTodos.length; i++){
				if(pastTodos[i].date === snapshot.key){
					console.log("i = " + i)
					break;
				}
			}

			pastTodoCount = pastTodoCount - 1;
			pastTodos.splice(i, 1);

			this.setState({todos: pastTodos})
			this.setState({todoCount: pastTodoCount})
		})


		this.database.on('child_changed', snapshot => {
			console.log("child_changed")
			for(let i=0; i < pastTodos.length; i++){
				if(pastTodos[i].date === snapshot.key){
					pastTodos[i].todoValue = pastTodos[i].todoValue + 1;
					break;
				}
			}
			this.setState({todos: pastTodos})
		})*/
	}


	componentWillUnmount() {
        this.database.off();
    }
	
	deleteAll(isTrue){
		if (isTrue){
			// console.log("is true",this.database.key)
			removeTodo(this.database);
		}
		this.setState({deleteAll: false})
		this.handleCloseModal();
	}

	addTodo(event){
		event.preventDefault();
		// Get info from form
		const { todoName } = event.target.elements; 
		
		const userId = db.auth().currentUser.uid;
		const todoId = `todo-${getDateWithTime()}`;

		// Todo must be integer >= 1
		if(todoName.value.length < 1) {
			alert("The to-do item's name must be one character or greater.");
			document.getElementById('todoName').value=''; 
			return false;
    }
		
		// Add Todo to database
		setTodo(db.database().ref(`users/${userId}/todos/${todoId}`), todoName.value, todoId, '', false);

		// Increment Todo count
		const newCount = this.state.todoCount + 1;
		this.setState({todoCount: newCount})

		// Clear form after submission
		document.getElementById('todoName').value=''; 
		this.handleCloseModal();
	}

	render(){
		const records = this.state.todos.map(todoItem =>
			<Todo
			todoName={todoItem.todoName}
			date={todoItem.date}
			key={todoItem.date}
			isCompleted={todoItem.isCompleted}
			/>
		);
	
		return (
			<div className="TodoFrameContainer">
				<h2 >To Do
				</h2>
				<div className='todoItemsBox' borderradius='1em' >
					{records}
				</div>

				<br />
				<div className="button-space">
					<Popup trigger={<button className="button flex" > Add To Do Item </button> } 
						modal
						open={this.state.showModal}
						onOpen={this.handleOpenModal}
						>
						{close => (
							<div className="modal">
								<button className="close" onClick={close}>
								&times;
								</button>
								<div className="header">
									<h1 className="labelHabit">Add a New To Do Item</h1>
								</div>
								<div className="content addtodocontent">
									{' '}
									<form  onSubmit={this.addTodo} >
										<label className="habitL">Name:</label>
										<br />
										<input className="formH" name='todoName' id='todoName' type='text' placeholder="To-Do Item"/>
										
										<br /> <br />
										<button className="button" type="submit">Add To Do Item</button>
										<button 
											id="cancel-add-button2"
											className="button cancel-add-button"
											onClick={() => {
											console.log('modal closed ');
											close();
											}}
										>Cancel</button>
									</form>
								</div>
									<br />
							</div>
						)}
					</Popup>


					<Popup trigger={<button className="button flex"> Clear All </button>} modal nested
						
					>
						{close => (
						<div className="modal">
							<button className="close" onClick={close}>
							&times;
							</button>
							<div className="header">
								<h1 className="labelHabit">Delete All Todos?</h1>
							</div>
							<div className="clear-all" >
								<button className="button clearbutton" onClick={()=>{
									this.handleDelete();
									close();
								}}>Yes</button>
								<button 
									id="cancel-add-button"
									className="button"
									onClick={() => {
									close();
									}}
								>Cancel</button>
							</div>
						</div>
						)}
					</Popup>
				</div>
			</div>
		);
    }
}