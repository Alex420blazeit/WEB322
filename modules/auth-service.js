const bcrypt = require("bcryptjs")
require("dotenv").config();
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User;

const userSchema = new Schema({ 
    userName: {
        type: String,
        unique: true,
    },
    password: String,
    email: String,
    loginHistory: [{ dateTime: Date, userAgent: String }]
  });

  
function intialize(){
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.mongoose);

        db.on('error', (err) => {
            reject(err);
        });
        db.once('open',() =>{
            User = db.model("user", userSchema);
            resolve();
        });
    });
}

function registerUser(userData){
    return new Promise ((resolve, reject) => {
        if(userData.password != userData.password2){
            reject("Passwords do not match")
        }
        else{
            let newUser = new User(userData)
            newUser.save()
            .then((savedUser) => {
                resolve(savedUser);
            })
            .catch((err) => {
                if (err.code === 11000) {
                    reject("User Name already taken");
                }
                else if(err && err.code != 11000){
                    reject(`There was an error creating the user: ${err}` )
                }
            });
        }
    })
    bcrypt
    .hash(users[0].password, 10)
    .then((hashedPassword) =>{
        const user = new User;
        name: users[0].name;
        password: hashedPassword
    })
    .catch((err) => {
        console.log(err)
    })
}

function checkUser(userData){
    User.find({userName: userData.userName})
    .then((users) =>{
        if (users.length === 0){
            return Promise.reject(`Unable to find user: ${userData.userName}`)
        }
        else if(users[0].password != userData.password){
            return Promise.reject(`Incorrect Password for user: ${userData.userName}`)
        }
        else if(users[0].password === userData.password){
            if(users[0].loginHistory.length == 8){
                users[0].loginHistory.pop()
            }
            users[0].loginHistory.unshift({dateTime: (new Date()).toString(), userAgent:
                userData.userAgent});
            User.updateOne({ userName: users[0].userName }, { $set: {loginHistory: users[0].loginHistory} })
            .then(()=>{
                return Promise.resolve(users[0])
            })
            .catch((err)=>{
                return Promise.reject(`There was an error verifying the user: ${err}`)
            })
        }
    })
    .catch((err) =>{
        return Promise.reject(`Unable to find user: ${userData.userName}`)
    })
    bcrypt
    .compare(userData.password, hash).then((result) => {
        if(result != userData.password){
            return Promise.reject(`Incorrect Password for user: ${userData.userName}`)
        }
    })
    
}