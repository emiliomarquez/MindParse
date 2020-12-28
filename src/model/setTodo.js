export default function setTodo(database, name, date, id, isCompleted) {
    database.set({
        todoName: name,
        date: date,
        completionDate: id,
        isCompleted: isCompleted
	});
}