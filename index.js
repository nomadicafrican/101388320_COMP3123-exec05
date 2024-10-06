const express = require("express");
const app = express();
const router = express.Router();

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
const path = require("path");

router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

/*
- Return all details from user.json file to client as JSON format
*/
const fs = require("fs");
const { json } = require("express/lib/response");
router.get("/profile", (req, res) => {
  fs.readFile("user.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "unable to read file" });
    }
    res.json(JSON.parse(data));
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/

router.post("/login", express.json(), (req, res) => {
  const { username, password } = req.body;

  fs.readFile("user.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "unable to read file" });
    }

    const user = JSON.parse(data);

    if (user.username !== username) {
      return res
        .status(400)
        .json({ status: false, error: "username is invalid" });
    }

    if (user.password !== password) {
      return res
        .status(400)
        .json({ status: false, error: "password is invalid" });
    }

    return res.json({ status: true, message: "user is valid" });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get("/logout/:username", (req, res) => {
  const username = req.params.username;
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  res.status(500).json({ message: "This is error router" });
});

app.use("/", router);

app.listen(process.env.port || 8081);

console.log("Web Server is listening at port " + (process.env.port || 8081));
