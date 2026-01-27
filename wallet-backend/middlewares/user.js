const jwt = require("jsonwebtoken");
const JWT_USER = process.env.JWT_USER


async function UserMiddleware(req,res,next){
    const token = req.headers.token;

    const User = jwt.verify(token,JWT_USER);
    if(User){
        req.UserId = User;
        next();
    }else{
        res.status(403).send("User Logged Out!")
    }
}

module.exports = {
    UserMiddleware: UserMiddleware
}