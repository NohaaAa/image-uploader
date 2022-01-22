const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const Cryptojs = require("crypto-js");
const router = require("express").Router();
// const User = require("../models/User");

//UPDATE user's user name, email, password
//request = {uuid: string}
router.put("/updateUser",verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password) {
        req.body.password = Cryptojs.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.body.uuid, {
            $set: req.body
        }, {new: true});
        updatedUser &&  res.status((200).json(updatedUser))

    }catch (err) {
        res.status(500).json(err);
    }
});

//DELETE USER
//request = {uuid: string, userId: string}

router.delete("/deleteUser", verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.userId);
        res.status(200).json("user has been deleted!");
    } catch (err) {
        res.status(500).json(err)
    }
});

//GET USER by id
//request = {uuid: string, userId: string}
router.get("/getUserById", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
});

//GET all users
//request = {uuid: string}
//url = api/users/all?new=true
router.get("/all", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find().sort({
                _id: -1
            }).limit(5)
            : await User.find()
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err)
    }
});

//GET user stats

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear((date.getFullYear() - 1)));

    try {
        const data = await User.aggregate([
            {$match : {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: {$month: "$createdAt"}
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).json(data)
    }catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
