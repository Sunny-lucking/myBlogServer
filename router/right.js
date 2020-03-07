
const express = require("express");
const router = express.Router();
import Right from "./../model/right"
const jwt = require("jsonwebtoken");
const passport = require("passport");     //引入passport中间件

router.get('/getRight',async (req,res)=>{

    let rights = await Right.find({})
    if (rights.length>0){
        res.json({
            code:0,
            msg:'获取权限列表成功',
            rights,
        })
    } else {
        res.json({
            code:-1,
            msg:'获取权限列表失败',
        })
    }
})
router.post('/addRight',async (req,res)=>{
    let {authName,id,level,pId,path} = req.body
    console.log(authName, id, level, pId, path);
    let result = await Right.create({authName, id, level, pId, path})
    return res.json({
        result
    })
})
router.post('/updateRight',async (req,res)=>{
    let {id,level,authName} = req.body
    console.log(id, level,authName);
    let result = await Right.updateOne({authName},{level,id})
    return res.json({
        result
    })
})



module.exports = router;
