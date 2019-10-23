/*********************************************************************************
*
*  Online (Heroku) Link: https://calm-everglades-64981.herokuapp.com/ 
*
********************************************************************************/ 

const path = require("path");
const express = require("express");
const app = express();
const httpPort = process.env.PORT || 8080;
const dataService = require("./data-service");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");


// Register handlebars as the rendering engine for views
app.engine('.hbs', exphbs({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");


// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
//app.use(bodyParser.urlencoded({ extended: false }));
// combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.

// app.use() ({extended: true});
app.use(bodyParser.urlencoded({ encoded: true }));

// call this function after the http server starts listening for requests
function httpToWork() {
  console.log("Express http server listening on " + httpPort);
}


app.use(express.static('public'));

//adding the following middleware function above your routes
//This will add the property "activeRoute" to "app.locals" whenever the route changes, ie: 
//if our route is "/employees/add", the app.locals.activeRoute value will be "/employees/add".
app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

//Next, we must use the following handlebars custom "helper" 
//•	This basically allows us to replace all of our existing navbar links,
// ie: <li><a href="/about">About</a></li> with code that looks like this {{#navLink "/about"}}About{{/navLink}}.
//  The benefit here is that the helper will automatically render the correct <li> element add the class "active" 
//if app.locals.activeRoute matches the provided url, ie "/about"
app.engine('.hbs', exphbs({
  extname: '.hbs',
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },

    //adding custom "helpers" let's add one more that we will need later:
    //This helper will give us the ability to evaluate conditions for equality, ie {{#equals "a" "a"}} … {{/equals}}
    // will render the contents, since "a" equals "a". It's exactly like the "if" helper, but with the added benefit 
    //of evaluating a simple expression for equality


    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);

      }

    }
  }
}))
// setup a 'route' to listen on the default url path (http://localhost)
// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "/views/home.html"));
// });
//--------------------------------------------------------------------------------
//change the GET route for "/" to "render" the "home" view, instead of sending home.html
app.get("/", function (req, res) {
  res.render('home');
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  // res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render('about');
});

// addEmployee
app.get("/employees/add", function (req, res) {
  // res.sendFile(path.join(__dirname + '/views/addEmployee.html'));
  res.render('addEmployee');
});

//	/employees?manager=value// 
app.get("/employee/:employeeNum", function (req, res) {
  dataService.getEmployeeByNum(req.params['employeeNum'])
    .then(result => {
      // res.json(result);
      //--------------------------
      res.render("employee", {employee:result});
    
    })
    .catch(error => res.render("employee", {message: "No Data Available"}))
});

//employees
app.get("/employees", function (req, res) {
  // console.log(req);

  if (req.query['department']) {
    console.log(req.query.department);
    dataService.getEmployeesByDepartment(req.query['department'])
      .then(result => {
        // res.json(result);
        res.render("employees", { employees: result });
      })
      .catch(error => res.render("employees", { message: "No Data Available" })); //console.log(error));
  } else if (req.query['manager']) {
    dataService.getEmployeesByManager(req.query['manager'])
      .then(result => {
        // res.json(result);
        res.render("employees", { employees: result });
      })
      .catch(error => { console.log(error); res.render("employees", { message: "No Data Available" }) }); //console.log(error));
  } else if (req.query['status']) {
    // console.log(req.query['status']);
    console.log('req status');
    dataService.getEmployeesByStatus(req.query['status'])
      .then(result => {
        // res.json(result);
        console.log('then');
        res.render("employees", { employees: result });
      })
      .catch(error => { console.log('catch'); res.render("employees", { message: "No Data Available" }) });//console.log(error));
  } else {
    dataService.getAllEmployees()
      .then(result => {
        // res.json(result);
        res.render("employees", { employees: result });
      })
      .catch(error => res.render("employees", { message: "No Data Available" }));// console.log(error));
  }
});

//managers
// app.get("/managers", function (req, res) {
//   dataService.getManagers()
//     .then(result => {
//       res.json(result);
//     })
//     .catch(error => console.log(error));
// });

//departments 
app.get("/departments", function (req, res) {
  dataService.getAllDepartments()
    .then(result => {
      // res.json(result);
      res.render("departments", {departments:result});
    })
    .catch(error => console.log(error));
});

// addImage
app.get("/images/add", function (req, res) {
  // res.sendFile(path.join(__dirname + '/views/addImage.html'));
  res.render('addImage');
});
dataService.initalize()
  .then(() => {
    app.listen(httpPort, httpToWork);
  })
  .catch(err => console.log(err));

// add images
app.get("/images", function (req, res) {
  let path = "./public/images/uploaded";
  fs.readdir(path, function (err, imagesArr) {// it a syntax err, and any name
    // res.json(images);

    res.render("images", { images: imagesArr })

  });
});

//setup a 'route' to listen on the url path(POST/images/add)
app.post("/images/add", upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});



// Adding "Post" route to listen on the url path (o	POST /employees/add)
app.post("/employees/add", function (req, res) {
  dataService.addEmployee(req.body)
    .then(res.redirect('/employees'))
    .catch(error => console.log(error));
});

// post for update
app.post("/employee/update", (req, res) => {
  console.log("update" + req.body);
  dataService.updateEmployee(req.body)
  .then(res.redirect('/employees'))
  .catch(error => console.log(error));
});


// (error 404) 
app.get("*", function (req, res) {
  // res.sendFile(path.join(__dirname + '/views/page404.html'));
  res.render('page404');
});


