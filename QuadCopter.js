// var count = 1; // global counter
// var maxCount = 5; // global maximum
// var myCountInterval = setInterval(function () {
//     console.log("Hello after " + (count++) + " second(s)");
//     checkMaximum();
// }, 1000);
// var checkMaximum = function () {
//     if (count > maxCount) {
//         clearInterval(myCountInterval);
//     }
// }
// outputs "Hello after 1 second" to the console
// setTimeout(function(){
//     console.log("Hello after 1 second");
// }, 1000);
// // var readline = require('readline');//input output
// // var rl = readline.createInterface({//creates interface rl
// //   input: process.stdin,
// //   output: process.stdout
// // });
// // rl.question('Enter Your Name: ', function(answer){
// //   console.log('Hello ' +  answer);
// //   rl.close();
// // });
// var message = require("./modules/message.js");
// message.writeMessage("Hello World!");
// message.readMessage();
// module.exports.readMessage = function () {
//     console.log(localMessage + " from " +  __filename);
//   }
//   var express = require("express");
// var app = express();
// var HTTP_PORT = process.env.PORT || 8080;
// // call this function after the http server starts listening for requests
// function onHttpStart() {
//   console.log("Express http server listening on: " + HTTP_PORT);
// }
// // setup a 'route' to listen on the default url path (http://localhost)
// app.get("/", function(req,res){
//    res.send("Hello World<br /><a href='/about'>Go to the about page</a>");
// });
// // setup another route to listen on /about
// app.get("/about", function(req,res){
//    res.send("<h3>About</h3>");
// });
// // setup http server to listen on HTTP_PORT
// app.listen(HTTP_PORT, onHttpStart);
// var architect = {name: "Joe",
//                   age: 34,
//                   occupation: "Architect",
//                   setAge: function(newAge){this.age = newAge},
//                   setName: function(newName){this.name = newName}
//                  };
// console.log(newAge.age);
function QuadCopter(height, velocity) {
    this.height = height;
    this.velocity = velocity;
    this.setFlightInfo = function (h, v) {
        this.height = h;
        this.velocity = v;
    };
    function QuadCopter();
    this.timeToLand = function () {
        return this.height / this.velocity;
    };
}
