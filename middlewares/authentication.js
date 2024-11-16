const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;
const authentication = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(403).json({
        message : "user not auithorized"
    });
    const token = authHeader.split(' ')[1];
    const decode = jwt.verify(token, SECRET);
    if(!decode) return res.status(403).json({
        message : "user not authorized"
    });
    req.userId = decode.userId;
    next();
    }catch(error){
        res.status(400).json({
            message : "unable to authorize"
        })
    }
}

module.exports = authentication;



// ayush -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzM3NDY4ODBhMzA0MGU5NzNlZGNhNDMiLCJpYXQiOjE3MzE2NzU3ODR9.4F2G0mfTLys29KRmF1Ty-_O9Y1asvRUYlXlyRUcdw0Q


// aditi -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzM3NDZhZWRjM2NkODE0ODMyNDdjNDkiLCJpYXQiOjE3MzE2NzU4MjJ9.fdZkUAfZPOE30QFklAWICRiShXb6kMR9H3OJyHQ96oM
