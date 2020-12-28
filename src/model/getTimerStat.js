import db from "../base";

export default function getTimer() {
    const database = db.database().ref(`users/${db.auth().currentUser.uid}/Timer`);

    return database.once('value')
        .then(snapshot => snapshot.val())
        .catch(error => console.log(error));
}