
export default function setHabit(database, name, val, goal, date, pin, color) {
    database.set({
        habitName: name,
        habitValue: val,
        habitStreak: 0,
        habitGoal: parseInt(goal),
        date: date,
        isPinned: pin,
        color: color
    });
}