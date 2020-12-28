export default function getTodo(database, pastTodos, pastTodoCount ){
    database.on('child_added', snapshot => {
        pastTodos.push(snapshot.val());
            return [pastTodos, snapshot.numChildren()];
        });

    database.on('child_removed', snapshot => {
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

        return [pastTodos, pastTodoCount];
    })


    database.on('child_changed', snapshot => {
        console.log("child_changed")
        for(let i=0; i < pastTodos.length; i++){
            if(pastTodos[i].date === snapshot.key){
                pastTodos[i].todoValue = pastTodos[i].todoValue + 1;
                break;
            }
        }
        return [pastTodos, pastTodoCount];
    })

    return [pastTodos, pastTodoCount];
}