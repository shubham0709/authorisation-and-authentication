const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { userModel } = require("../models/user.model");

const authentication = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send("login again");
    }
    const token = req.headers.authorization;
    let email;
    await jwt.verify(token, 'secret', async (err, decoded) => {
        if (err) {
            return res.send("login again!");
        } else {
            email = decoded.email;
        }
    });
    req.body.email = email;
    next();
}

const authorisation = (permittedRole) => {
    return async (req, res, next) => {
        const { email } = req.body;
        let userdata = await userModel.findOne({ email: email });
        // return res.send(userdata);
        if (!permittedRole.includes(userdata.role)) {
            return res.send("not authorised !!");
        } else {
            next();
        }
    }
}

module.exports = { authentication, authorisation };