const JWT = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try {
        console.log("Before the token")
        const token = req.headers.authorization.split(" ")[1];
        const decode = JWT.verify(token, process.env.JWT_KEY);
        console.log("Token: "+ token)
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Authorization failed'
        })
    }
}