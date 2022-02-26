const router = require("express").Router();
const User = require("../models/User");
const Cryptojs = require("crypto-js");
const jwt = require('jsonwebtoken');

//check if userEmail is existed before:
const findUserByEmail = async(userEmail) => {
    const user = await User.findOne({email: userEmail});
    if(user) {
        return user;
    } else {
        return undefined;
    }
}

const checkUserPassword = (dbPassword,userPassword) => {
    //decrypt the user pass to compare with the received pass
    const hashedPassword =  Cryptojs.AES.decrypt(
        dbPassword,
        process.env.PASS_SEC
    );

    return hashedPassword.toString(Cryptojs.enc.Utf8) === userPassword;
}
//REGISTER
//request = { username: string, email: string, password: string, isAdmin?: boolean}
router.post("/signup", async (req, res) => {
    if(req.body.username && req.body.email && req.body.password) {
        let isUserExisted = await findUserByEmail(req.body.email);

        isUserExisted && res.status(200).json('this email is already registered!');
        if(!isUserExisted) {
            const newUSer = new User({
                username: req.body.username,
                email: req.body.email,
                password: Cryptojs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
            });
            try{
                //save new user into db
                const savedUSer = newUSer.save();
                res.status(201).json(newUSer);
            } catch(err){
                res.status(500).json(err);
            }
        }
    } else {
        res.status(400).json("Bad Request!");
    }

});

//LOGIN
//request = {email: string, password: string}
router.post("/login", async(req, res) => {
    if(req.body.email && req.body.password) {
        try{
            //find the user by his unique email
            const user = await findUserByEmail(req.body.email);
            //if no user, send an error code
            !user && res.status(400).json("Wrong Email!");

            !checkUserPassword(user.password, req.body.password) &&
            res.status(401).json("wrong password!");
            //create user token
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, process.env.JWT_SEC, {expiresIn: "3d"})
            //send back user info except for password
            const {password, ...others} = user._doc;
            checkUserPassword(user.password, req.body.password) && user && res.status(200).json({...others, accessToken});

        }catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(400).json("Bad Request!");
    }
});

module.exports = {router, checkUserPassword};
