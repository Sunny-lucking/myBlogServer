import User from "../model/users";
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.post('/signup', async (req,res) => {
    console.log("我进来注册了");
    const {username, password, email, code} = req.body

    let user = await User.find({username})
    if (user.length) {
        return res.json({
            code: -1,
            msg: '已被注册'
        })
    }
    let nuser = await User.create({username, password, email})
    if (nuser){
        return res.json({
            code:0,
            msg:'注册成功',
        })
    } else{
        res.json({
            code:-1,
            msg:"失败"
        })
    }
})

router.post("/login",async (req,res)=>{
    const {username,password} = req.body;
    const users = await User.find({})
    const user = await User.findOne({username})
    if (!user){
        return res.json({
            msg:'用户不存在',
            code:-1
        })
    }else{
        if (user.password === password){
            const rule = {username:user.username,_id:user._id,cover:user.cover};
            jwt.sign(rule,'secret',{expiresIn:3600},(err,token)=>{
                if(err){
                    throw err
                }else{
                    return res.json({
                        msg:'登陆成功',
                        blogFrontToken:'Bearer' + token,
                        code:0
                    })
                }
            })
        }else{
            return res.json({
                msg:'密码错误',
                code:-1
            })
        }
    }

});

router.get('/getOneUser',async (req,res) => {
    console.log("getOnde");
    let {userId}  = req.query;
    console.log(userId);
    console.log('getOneId');
    console.log(userId);
    let user = await User.find({_id:userId})
    if(user){
        return res.json({
            code:1,
            user
        })
    }else{
        return res.json({
            code:-1,
            msg:'错误'
        })
    }
})
module.exports = router;
