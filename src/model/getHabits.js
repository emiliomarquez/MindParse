import db from "../base";

export default function getHabits() {
    const database = db.database().ref(`users/${db.auth().currentUser.uid}/habits`);
    return database.once('value')
        .then(snapshot => snapshot.val())
        .catch(error => console.log(error));
}