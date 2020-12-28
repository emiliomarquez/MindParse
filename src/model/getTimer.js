import db from "../base";

export default function getTimer() {
    const tempDate = new Date();
    const date = (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + '-' + tempDate.getFullYear();
    const database = db.database().ref(`users/${db.auth().currentUser.uid}/Timer/${date}`);

    return database.once('value')
        .then(snapshot => snapshot.val())
        .catch(error => console.log(error));
}