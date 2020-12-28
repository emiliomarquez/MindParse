//get current date function
export function getCurrentDate(separator='-'){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${month<10?`0${month}`:`${month}`}${separator}${date}${separator}${year}`
}

export function getDateWithTime(separator=":"){
    let date = getCurrentDate();
    let timeDate = new Date();

    return date +`${" "}${timeDate.getHours()}${separator}${timeDate.getMinutes()}${separator}${timeDate.getSeconds()}`
}
