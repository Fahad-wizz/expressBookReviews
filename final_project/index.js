const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token){
        if(token.startsWith('Bearer ')){
            token = token.slice(7,token.length);
        }
        jwt.verify(token, 'secretkey', (err,decoded)=>{
            if(err){
                return res.json({
                    success:0,
                    message:"Invalid Token"
                });
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        return res.json({
            success:0,
            message:"Access Denied! Unauthorised User"
        });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running on port : " + PORT));
