/*global chrome*/

let timeLeft, isActive, sessionType, interval;

const workLength = 60*25;
const breakLength = 60*5;
const imgURL = "MindParseLogo.png";

chrome.runtime.onInstalled.addListener(function () {
    timeLeft = workLength;
    isActive = false;
    sessionType = 'work';
    interval = null;
});

var workNotifOpt = {
    title: 'Work Timer Ended',
    message: 'Take a break, you deserve it!',
    iconUrl: imgURL,
    type: 'basic'
};

var breakNotifOpt = {
    title: 'Break Timer Ended',
    message: "Let's get back to work!",
    iconUrl: imgURL,
    type: 'basic'
};

const start = () => {
    isActive = true;
    interval = setInterval(() => {
        if (timeLeft === 0) {
            let audio = new Audio("notification.mp3");
            audio.play();


            if (sessionType === 'work') {
                chrome.notifications.create(workNotifOpt, function() { console.log("error work = " + chrome.runtime.lastError); });
                timeLeft = breakLength;
                sessionType = 'break';

            } else {
                chrome.notifications.create(breakNotifOpt, function() { console.log("error break = " + chrome.runtime.lastError); });
                chrome.runtime.sendMessage(chrome.runtime.id, {
                    cmd: "timerFinished",
                    value: ""
                });
                stop();
            }

        } else {
            timeLeft = timeLeft - 1;
        }


        chrome.runtime.sendMessage(chrome.runtime.id, {
            cmd: "getState",
            value: {
                timeLeft: timeLeft,
                isActive: isActive,
                sessionType: sessionType
            }
        });

        }, 1000);
}

const pause = () => {
    isActive = false;
    clearInterval(interval);
}

const stop = () => {
    isActive = false;
    clearInterval(interval)
    timeLeft = workLength;
    sessionType = 'work';
}

chrome.runtime.onMessage.addListener(function(message, sender, reply) {
    if (message.cmd === 'toggle') {
        if (isActive) {
            pause();
        } else {
            start();
        }
        console.log("toggle");

    } else if (message.cmd === 'stop') {
        stop();
        console.log("stop");

    } else if (message.cmd === 'getState') {
        console.log('getState')
    }

    chrome.runtime.sendMessage(chrome.runtime.id, {
        cmd: "getState",
        value: {
            timeLeft: timeLeft,
            isActive: isActive,
            sessionType: sessionType
        }
    });
});