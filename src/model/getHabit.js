export default function getHabits(database, pastHabits){
    database.on('child_added', snapshot => {
        console.log("child_added")
        pastHabits.push(snapshot.val())
        return pastHabits
    });


    database.on('child_removed', snapshot => {
        console.log("child_removed")

        let i = 0;
        for(; i < pastHabits.length; i++){
            if(pastHabits[i].date === snapshot.key){
                console.log("i = " + i)
                break;
            }
        }

        pastHabits.splice(i, 1);

        return pastHabits
    })


    database.on('child_changed', snapshot => {
        console.log("child_changed")
        for(let i=0; i < pastHabits.length; i++){
            if(pastHabits[i].date === snapshot.key){
                pastHabits[i] = snapshot.val();
                break;
            }
        }
        return pastHabits
    })

    return pastHabits
}