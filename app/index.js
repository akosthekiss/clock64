/*
 * Copyright (c) 2020 Akos Kiss.
 *
 * Licensed under the BSD 3-Clause License
 * <LICENSE.md or https://opensource.org/licenses/BSD-3-Clause>.
 * This file may not be copied, modified, or distributed except
 * according to those terms.
 */

import clock from "clock";
import document from "document";
import { me as device } from "device";
import { memory } from "system";


// Update the clock every second
clock.granularity = "seconds";

// Get a handle on the char elements
function getChar(id) {
  return document.getElementById(id).firstChild;
}

let modelChars = [
  getChar("model-0"), getChar("model-1"), getChar("model-2"), getChar("model-3"),
  getChar("model-4"), getChar("model-5"), getChar("model-6"), getChar("model-7"),
  getChar("model-8"), getChar("model-9"), getChar("model-10"), getChar("model-11"),
  getChar("model-12"), getChar("model-13"), getChar("model-14"), getChar("model-15"),
  getChar("model-16"), getChar("model-17"), getChar("model-18"), getChar("model-19"),
  getChar("model-20"), getChar("model-21"), getChar("model-22"), getChar("model-23"),
  getChar("model-24"), getChar("model-25"), getChar("model-26"), getChar("model-27"),
  getChar("model-28"), getChar("model-29"), getChar("model-30"), getChar("model-31")
];

let bytesChars = [
  getChar("bytes-0"), getChar("bytes-1"), getChar("bytes-2"), getChar("bytes-3"),
  getChar("bytes-4"), getChar("bytes-5"), getChar("bytes-6"), getChar("bytes-7"),
  getChar("bytes-8"), getChar("bytes-9"), getChar("bytes-10"), getChar("bytes-11"),
  getChar("bytes-12"), getChar("bytes-13"), getChar("bytes-14"), getChar("bytes-15"),
  getChar("bytes-16"), getChar("bytes-17"), getChar("bytes-18"), getChar("bytes-19"),
  getChar("bytes-20"), getChar("bytes-21"), getChar("bytes-22"), getChar("bytes-23"),
  getChar("bytes-24"), getChar("bytes-25"), getChar("bytes-26"), getChar("bytes-27"),
  getChar("bytes-28"), getChar("bytes-29"), getChar("bytes-30"), getChar("bytes-31")
];

let readyChars = [
  getChar("ready-0"), getChar("ready-1"), getChar("ready-2"), getChar("ready-3"),
  getChar("ready-4"), getChar("ready-5")
];

let cursorChar = getChar("cursor");

let timeChars = [
  getChar("time-0"), getChar("time-1"), getChar("time-2"), getChar("time-3"), getChar("time-4")
];

let dateChars = [
  getChar("date-0"), getChar("date-1"), getChar("date-2"), getChar("date-3"),
  getChar("date-4"), getChar("date-5"), getChar("date-6"), getChar("date-7"),
  getChar("date-8"), getChar("date-9"), getChar("date-10"), getChar("date-11"),
  getChar("date-12"), getChar("date-13"), getChar("date-14"), getChar("date-15")
];

// Date strings
const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const dayNames = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

// Character name mapping
const charNames = {
  ":": "COLON",
  ",": "COMMA",
  ".": "PERIOD",
  "-": "MINUS",
  "/": "SLASH",
  "*": "ASTERISK",
  " ": "SPACE",
};

function getCharHref(c, size) {
  c = charNames.hasOwnProperty(c) ? charNames[c] : c;
  return "vic2/" + size + "/" + c + ".png";
}

function writeString(line, str, size) {
  for (let i = 0; i < str.length; i++) {
    line[i].href = getCharHref(str.charAt(i), size);
  }
}

function centerString(line, str) {
  const pad = Math.floor((line.length - str.length) / 2);
  for (let i = 0; i < pad; i++) {
    str = " " + str;
  }
  while (str.length < line.length) {
    str += " ";
  }
  return str;
}

var lastHours = null;
var lastMinutes = null;
var lastYears = null;
var lastMonths = null;
var lastDays = null;

var cursorState = false;

function updateClock(evt) {
  let now = evt.date;

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let years = now.getFullYear();
  let months = now.getMonth();
  let days = now.getDate();

  if ((lastHours !== hours) || (lastMinutes !== minutes)) {
    let timeStr = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
    writeString(timeChars, timeStr, 48);

    lastHours = hours;
    lastMinutes = minutes;
  }

  if ((lastYears !== years) || (lastMonths !== months) || (lastDays !== days)) {
    let dateStr = dayNames[now.getDay()] + ", " + ("0" + days).slice(-2) + "-" + monthNames[months] + "-" + years;
    writeString(dateChars, dateStr, 16);

    lastYears = years;
    lastMonths = months;
    lastDays = days;
  }

  cursorChar.href = getCharHref(cursorState ? "SPACE" : "FULL", 8);
  cursorState = !cursorState;
}

// Update the clock every tick event
clock.ontick = updateClock;

// Don't start with a blank screen
updateClock({ date: new Date() });

// Display model/ram data and ready message
let modelStr = "** " + device.modelName.toUpperCase() + " V" + device.firmwareVersion + " **";
writeString(modelChars, centerString(modelChars, modelStr), 8);

let bytesStr = Math.floor(memory.js.total / 1024) + "K JS RAM  " + (memory.js.total - memory.js.used) + " BYTES FREE";
writeString(bytesChars, centerString(bytesChars, bytesStr), 8);

writeString(readyChars, "READY.", 8);
