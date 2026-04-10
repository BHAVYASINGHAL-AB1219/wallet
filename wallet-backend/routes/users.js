const { Router } = require("express");
const {z} = require("zod");
const bcrypt = require("bcrypt")
const UserRouter = Router();
const { UsersModel } = require("../db")
const { UserMiddleware } = require("../middlewares/user");
const JWT_USER = process.env.JWT_USER
const jwt = require("jsonwebtoken")




UserRouter.post("/signup",async function(req,res){
    const { email, password, name} = req.body;

    const signupschema = z.object({
        email: z.string().email("Please enter a valid email address."),
        password: z.string().min(6).refine((val) => /[a-z]/.test(val) && /[A-Z]/.test(val), {
            message: "Password must be at least 6 characters long and include both uppercase and lowercase letters."
        }),
        name: z.string()
    })

    const isdatasafe =  signupschema.safeParse(req.body);
    //console.log(isdatasafe.error.message);
    if(isdatasafe.success){
        const hashedpassword = await bcrypt.hash(password,5);
        await UsersModel.create({
            email,
            hashedpassword,
            name
        })
        res.status(200).json({
            message: "Signup succeded!"
        })
    }else{
        res.status(403).json({
            error: isdatasafe.error.issues
        })
    }
})

UserRouter.post("/signin",async function(req,res){
    const { email, password } = req.body;
    
    
    const signinschema = z.object({
        email: z.string().email(),
        password: z.string().min(6, {message: "password minimum length should be six"}).refine((val) => /[a-z]/.test(val) && /[A-Z]/.test(val), {
            message: "password must contain atleast one Lowercase and Uppercase letter"
        })
    }) 

    const isdatasafe = signinschema.safeParse(req.body);

    if(isdatasafe.success){
        const user = await UsersModel.findOne({
            email: email,
        })
        if(user){
            const passwordmatch = await bcrypt.compare(password,user.hashedpassword);

            if(passwordmatch){
                const token = jwt.sign({
                    id: user._id.toString()
                },JWT_USER)
                res.status(200).json({
                    message: "signin successful",
                    token: token
                })
            }else{
                res.status(403).json({
                    message: "Invalid Password!"
                })
            }
        }else{
            res.status(403).json({
                message: "Invalid Username!"
            })
        }
    }else{
        res.status(403).json(isdatasafe.error.issues)
    }
})


module.exports = {
    UserRouter
}