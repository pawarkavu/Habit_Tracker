
let dates;
init();

//Function to initalize the page 
function init() {                                   
    let button = document.getElementById('week');
    button.onchange = setDates;
    let str;
    console.log(localStorage.getItem("week"))
    if (localStorage.getItem("week") == null) {
        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(), 0, 1);
        var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
        
        var weekNumber = Math.ceil(days / 7);
        str = currentDate.getFullYear() + "-W" + weekNumber
        localStorage.setItem("week", str);
    } else {
        str = localStorage.getItem("week");
    }
    let week = document.getElementById('week');
    week.value = str;
    setDates();
    console.log(week.value);
}

// sets calendar date based on week input and then calls makecalendar() function.
async function setDates() {                         
    
    let week = document.getElementById('week');
    dates = parseDates(week.value);
    localStorage.setItem("week", week.value);       
    console.log(dates);
    data = await getData();
    console.log(data);
    data = JSON.parse(data)["habits"];               
    console.log(data);
    makeCalender();
}
let data;

// Makes calendar area for every Habit as per the inputs passed through setDates()
// Assign changestatus functionality to all the dates by using onclick.
function makeCalender() {                           
    
    let habits = document.querySelectorAll(".habit");
    habits.forEach((habit) => {
        let calenderArea = habit.querySelector(".calenderArea");
        let id = habit.querySelector("#ID").innerText;
        let currentEle = data.filter((ele) => { return ele.ID == id.trim() })
        console.log(currentEle,id,data);
        let str = "";
        dates.forEach((date) => {
            str += `<div class="col card">
            <br>
            <div class="mx-auto">${date.substring(0, 11)}</div>`
            if (new Date(date + " 00:00:00 GMT") > new Date()) {
                str += `<button type="button" class="btn btn-secondary" disabled>
            <i class="bi bi-dash-lg"></i>
            </button>`
            } else {
                if (currentEle[0].DoneDates.includes(date)) {
                
                    str += `<button type="button" class="btn btn-success" onclick = "changeStatus('${id.trim()}','${date}','done')">
            <i class="bi bi-check-lg"></i>
            </button>`
                } else if (currentEle[0].NotDoneDates.includes(date)) {
                
                    str += `<button type="button" class="btn btn-danger" onclick = "changeStatus('${id.trim()}','${date}','not done')">
            <i class="bi bi-x-lg"></i>
            </button>`
                } else {
                    str += `<button type="button" class="btn btn-secondary" onclick = "changeStatus('${id.trim()}','${date}','undefined')">
            <i class="bi bi-dash-lg"></i>
            </button>`
                }
            }
            str+="<br></div>"
        })
        calenderArea.innerHTML = str;
    })
}

// To parse the week of Format yyyy-Www;
// It returns array of dates with string values;
// Reference taken from GeeksforGeeks
function parseDates(inp) {
    let year = parseInt(inp.slice(0, 4), 10);
    let week = parseInt(inp.slice(6), 10);

    let day = (1 + (week ) * 7); // 1st of January + 7 days for each week

    let dayOffset = new Date(year, 0, 1).getDay(); // we need to know at what day of the week the year start

    dayOffset--;  // depending on what day you want the week to start increment or decrement this value. This should make the week start on a monday

    let days = [];
    for (let i = 0; i < 7; i++) // do this 7 times, once for every day
        days.push((new Date(year, 0, day - dayOffset + i)).toDateString()); // add a new Date object to the array with an offset of i days relative to the first day of the week
    return days;
}

// Funtion to call the API and add new habit.
function AddHabit() {
    let name = document.getElementById("HabitName").value;
    let Time = document.getElementById("HabitTime").value;
    if (name == "") return;
    let data = { Name:name, Time };
    let raw = JSON.stringify(data);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'POST',
        body: raw,
        headers: myHeaders
    };
    console.log(raw);
    fetch("http://localhost:5000/add", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            location.reload();
        })
        .catch(error => console.log('error', error));

}

// Fuction to call the delete API.
// Unique id is passes that will render the data and delete it.
function deleteHabit(id) {
    let data = { ID:id };
    let raw = JSON.stringify(data);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'POST',
        body: raw,
        headers: myHeaders
    };
    console.log(raw);
    fetch("http://localhost:5000/delete", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            location.reload();
        })
        .catch(error => console.log('error', error));

}

// Function to call the getData API.
async function getData() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };
    // let data;
    await fetch("http://localhost:5000/getData", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result);
        data = result;
        // return result;
        // location.reload();
    })
    .catch(error => console.log('error', error));
    return data;
}

// Function to call the setData API to set the current habits.
async function setData(sent) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify(sent);
    console.log(raw);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body:raw,
    };
    await fetch("http://localhost:5000/setData", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            location.reload();
        })
        .catch(error => console.log('error', error));
    return data;
}

// Function to set the status of the habits that can be changed as many times as required. 
function changeStatus(ID, date, current) {
    let currentEle = data.filter((ele) => { return ele.ID == ID.trim() })
    console.log(currentEle);
    if (current == "done") {
        currentEle[0].NotDoneDates.push(date);
        currentEle[0].DoneDates.splice(currentEle[0].DoneDates.indexOf(date),1);
    } else if (current == "not done") {
        currentEle[0].NotDoneDates.splice(currentEle[0].NotDoneDates.indexOf(date),1);
    } else {
        currentEle[0].DoneDates.push(date);
    }
    currentEle[0].DoneDates.sort(function (a, b) {
        return new Date(a) - new Date(b);
    });
    currentEle[0].NotDoneDates.sort(function (a, b) {
        return new Date(a) - new Date(b);
    });
    currentEle[0].BestStreak = findLongestConseqSubseq(currentEle[0].DoneDates); // longest continous habbit recorded till date  
    currentEle[0].Current = findLastConseqSubseq(currentEle[0].DoneDates); // current continous habbit recorded till today. 
    currentEle[0].TotalTracked = currentEle[0].DoneDates.length + currentEle[0].NotDoneDates.length;
    currentEle[0].TotalDone = currentEle[0].DoneDates.length;
    setData(currentEle[0]);
    console.log(data, currentEle);
    makeCalender();
}

// Counverts dates into particlar number to calculate the values of findLongestConseqSubseq & findLastConseqSubseq
function makeArrOfDate(arr) {
    arr = arr.map((ele) => { return (new Date(ele + " 00:00:00 GMT")) / 86400000; })
    return arr;
}

// current continous habbit recorded till today. 
function findLastConseqSubseq(arr) {
    let n = arr.length;
    arr = makeArrOfDate(arr);
    let ans = 1;
    for (let i = n - 2; i >= 0; i--){
        if (arr[i] == arr[i + 1]-1) {
            ans += 1;
        } else {
            console.log(ans);
            return ans;
        }
    }
    return ans;
}

// longest continous habbit recorded till date  
function findLongestConseqSubseq(arr) {
    let n = arr.length;
    arr = makeArrOfDate(arr);
    let S = new Set();
    for (let i = 0; i < n; i++)
        S.add(arr[i]);
    let ans = 0;
    for (let i = 0; i < n; i++) {
        if (!S.has(arr[i] - 1)) {
            let j = arr[i];
            while (S.has(j))
                j++;
            ans = Math.max(ans, j - arr[i]);
        }
    }
    console.log(ans)
    return ans;
}
