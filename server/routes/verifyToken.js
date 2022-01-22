const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if(err) res.status(403).json("Invalid Token");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("Invalid Auth");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    if(req.body.uuid) {
        verifyToken(req, res, () => {
            if(req.user.id === req.body.uuid) {
                next();
            } else {
                res.status(403).json("user is not allowed to do that!!");
            }
        })
    } else {
        res.status(400).json("Bad Request!");
    }
}
const verifyTokenAndAdmin = (req, res, next) => {
    if(req.body.uuid) {
        verifyToken(req, res, () => {
            if(req.user.isAdmin) {
                next();
            } else {
                res.status(403).json("user is not allowed to do that!!");
            }
        })
    } else {
        res.status(400).json("Bad Request!");
    }
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};
