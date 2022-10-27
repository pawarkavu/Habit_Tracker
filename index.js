let express = require("express");
const path = require('path');
const { v4: uuidv4 } = require('uuid')
let Habit = require('./mongoose');
let app = express();
// let habits = ["Workout","Reading","Wakeup early"];
// let habits = [
//     {
//     Name:"Workout",
//     BestStreak:4,
//     Current: 3,
//     TotalDone: 24,
//     TotalToDo: 81,
//     Time: "10:00 AM",
//     },
//     {
//         Name:"Reading",
//         BestStreak:4,
//         Current: 3,
//         TotalDone: 24,
//         TotalToDo: 81,
//         Time: "10:00 AM",
//     },
//     {
//         Name:"Wakeup early",
//         BestStreak:4,
//         Current: 3,
//         TotalDone: 24,
//         TotalToDo: 81,
//         Time: "10:00 AM",
//     },
// ]

app.use(express.static(path.join(__dirname,'./assets')))
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.get("/detail",(req,res) =>{
    // res.render("detail", {title: "Detail view", habits:habits, detailActive:true});
    Habit.find({}, function (err, data){
        if (err) throw err;
        res.render('detail',{title: "Detail View", habits: data,detailActive: true});
    });
})
app.get("/week", (req, res) => {
    Habit.find({}, function (err, data) {
        if (err) throw err;
        res.render('Detail', { title: "Week View", habits: data, detailActive: false })
    });
    
})
app.post("/delete", async (req, res) => {
    let data = req.body;
    let doc = await Habit.findOneAndDelete({ ID: data.ID });
    console.log(doc, data);
    res.json({ habit: doc })
    // habits = [data, ...habits];
    // console.log(data);
    // console.log(habits);
    //     res.send("success")
})


app.get("/getData", (req, res) => {
    Habit.find({}, function (err, data) {
        if (err) throw err;
        res.json({habits: data})
    });

})

app.post("/setData", async (req, res) => {
    let data = req.body;
    let doc = await Habit.findOneAndUpdate({ ID: data.ID }, { ...data }, { new: true });
        console.log(doc,data);
        res.json({ habit: doc })
    // doc = { ...data };
    // await doc.save();
    // let doc = await Habit.findOneAndUpdate({ ID: data.ID }, { data }, { new: true })
    // Habit.find({}, function (err, data) {
    //     if (err) throw err;
    //     res.json({habits: data})
    // });

})

app.post("/add",(req,res) => {
    let ID = uuidv4()
    let data = {...req.body,
        BestStreak:0,
        Current: 0,
        TotalDone: 0,
        TotalTracked: 0,
        ID,
        DoneDates:[],
        NotDoneDates:[],
}
    
    var newHabit = Habit(data).save(function(err,data){
        if (err) throw err;
                res.json(data);
    });
})
    // habits = [data,...habits];
    // console.log(req.body);
    // response.send("Success");
app.listen(5000,() => {console.log("listening")})


