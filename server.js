const express = require("express");
const { connection } = require("./config");
const { userModel } = require("./models/user.model");
const bcrypt = require("bcrypt");
const { productRouter } = require("./controller/product.controller");
const { authentication, authorisation } = require("./middlewares/auth");

const jwt = require('jsonwebtoken');

const app = express();
const PORT = 7000;
app.use(express.json());

const logger = (req, res, next) => {
    console.log(req.url);
    next();
}

app.get("/", (req, res) => {
    res.send("home page");
})

app.post("/signup", async (req, res) => {
    const { email, password, age } = req.body;
    await bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            return res.send("some error occured, couldn't login");
        }
        try {
            const newuser = new userModel({
                email, password: hash, age
            })
            newuser.save();
            return res.send("signup successfull");
        } catch {
            return res.send("signup failed, try again!!");
        }
    });
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    let matchedUser = await userModel.find({ email });

    if (matchedUser.length == 0) {
        return res.send("invalid creds");
    }

    let hash = matchedUser[0]["password"];

    bcrypt.compare(password, hash, async (err, result) => {
        if (err) {
            return res.send("error in login!!");
        }
        if (result === false) {
            return res.send("Invalid creds!!");
        } else {
            //TODO generate JWT TOKEN
            const token = await jwt.sign({
                email: matchedUser[0]["email"],
                age: matchedUser[0]["age"],
                id: matchedUser[0]["_id"]
            }, process.env.secretKey);
            return res.send({ message: "login success", token: token });
        }
    });
})

app.use("/product", productRouter);

// app.get("/dashboard", authentication, authorisation(["admin"]), async (req, res) => {
//     return res.send("Welcome to admin dashboard");
// })

// app.get("/seller", authentication, authorisation(["admin", "seller"]), async (req, res) => {
//     return res.send("Welcome to seller dashboard");
// })

app.get("/dashboard", (req, res) => {
    res.send("dashboard");
})

app.listen(PORT, async () => {
    try {
        await connection;
        console.log("database connected");
    } catch {
        console.log("ERROR!! database not connected")
    }
    console.log("server started on port : " + PORT);
})