const userModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const zod = require('zod');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const SECRET = process.env.SECRET;


// -- Register New User --
const registerBody = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string()
})
const registerUser = async (req, res) => {
    try {
        const { success } = registerBody.safeParse(req.body);
        if (!success) return res.status(403).json({
            message: "error while creating user"
        });
        const { username, email, password } = req.body;
        const existingUserCheck = await userModel.findOne({
            $or : [{username}, {email}]
        });
        if (existingUserCheck) return res.status(403).json({
            message: "error while creating user"
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                const newUser = await userModel.create({
                    username,
                    email,
                    password: hash
                });
                const token = jwt.sign({ userId: newUser._id }, SECRET);
                res.status(200).json({
                    message: "user created successfully",
                    token: token
                })
            })
        })
    } catch (error) {
        res.status(400).json({
            messgae: "error while creating user!"
        })
    }
}


// -- Login User --
const loginBody = zod.object({
    email: zod.string().email(),
    password: zod.string()
})
const loginUser = async (req, res) => {
    try {
        const { success } = loginBody.safeParse(req.body);
        if (!success) return res.status(403).json({
            message: "error while logging in"
        });
        const { email, password } = req.body;
        const existingUserCheck = await userModel.findOne({ email });
        if (!existingUserCheck || "") return res.status(400).json({
            message: "error while logging in"
        });
        bcrypt.compare(password, existingUserCheck.password, (err, result) => {
            if (!result) return res.status(403).json({
                message: "error while loggin in"
            })
            const token = jwt.sign({ userId: existingUserCheck._id }, SECRET);
            res.status(200).json({
                message: "user logged in successfully",
                token: token
            })
        });
    } catch (error) {
        res.status(403).json({
            message: "error while loggin in"
        })
    }
}


// -- Profile of user --
const profile = async (req, res) => {
    try { 
        const user = await userModel.findOne({_id : req.userId});
        res.status(200).json({
            profile : user
        })
    }catch(error){
        res.status(403).json({
            message : "something went wrong"
        })
    }
}


// -- Validator for each page --
const validate = async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) return res.json({
            state : false
        });
        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, SECRET);
        if(!decode) return res.json({
            state : false
        });
        res.json({
            state : true
        })
    }catch(error){
        res.json({
            state : false
        })
    }
}



module.exports = {registerUser, loginUser, profile, validate};
