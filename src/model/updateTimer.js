import db from "../base";

export default function updateTimer(completed, stopped) {
    const tempDate = new Date();
    const date = (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + '-' + tempDate.getFullYear();
    const database = db.database().ref(`users/${db.auth().currentUser.uid}/Timer/${date}`);

    database.set({
        completed: completed,
        stopped: stopped
    });

}