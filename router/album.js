import Album from "../model/albums";
import Users from "../model/users"
import {basename} from "path"
import formidable from "formidable"
import config from "./../src/config"
const express = require("express");
const router = express.Router();
let fs = require('fs');
router.get('/getAlbum',async (req,res) =>{

    let {userId}  = req.query;
    let result = await Album.find({userId:userId});
    if (result){
        return res.json({
            result,
            msg:'获取相册成功'
        })
    }else {
        return res.json({
            code:-1,
            msg:'没有相册'
        })
    }

})
router.post('/addAlbum', (req,res) =>{

    console.log("我来添加图片了");
    let form = new formidable.IncomingForm()
    form.uploadDir = config.publicPath
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        let imageUrl = basename(files.file.path);
        let userId = fields.userId;
        console.log(userId);

        const newAlbum = new Album({
            url:imageUrl,
            userId,
        })
        newAlbum.save((err,doc)=>{
            if (err){
                throw err
            } else {
                console.log(userId);
                console.log(doc);
                console.log('dsdsd');
                return res.json({
                    userId,
                    msg:'返回这里说明上面保存数据库ssss失败'
                })
            }
        })
        // Album.create()
        // console.log(result);
        // return  {
        //     result,
        //     msg:"成功"
        // }

    })




})
router.post('/changeAvatar', (req,res) =>{
    console.log("修改头像");
    let form = new formidable.IncomingForm()
    form.uploadDir = config.publicPath
    form.keepExtensions = true
    form.parse(req, async (err, fields, files)=> {
        let imageUrl = basename(files.file.path);
        let userId = fields.userId;
        console.log("userId:"+userId);
        console.log(imageUrl);
        let newUser = await Users.updateOne({_id:userId},{cover:imageUrl})
        res.json({
            newUser
        })
    })



})
// router.post('/addTag',async (req,res) =>{
//     console.log("添加标签接口");
//     let { articleID,tagName} = req.body
//     console.log(articleID, tagName);
//     let tag = await Tag.find({tagName:tagName})
//     console.log(tag);
//     if(tag.length){
//         tag[0].articleIDs.push(articleID)
//         tag[0].save();
//         console.log('文章已添加标签');
//         return res.json({
//             code:0,
//             msg:'文章已添加标签'
//         })
//     }else{
//         let TempTag = Tag.create({tagName,articleIDs:[articleID]})
//         if (TempTag) {
//             console.log('添加新标签成功');
//             res.json({
//                 code:0,
//                 msg:'添加新标签成功'
//             })
//         }else {
//             res.json({
//                 code: -1,
//                 msg:'添加新标签失败'
//             })
//
//         }
//     }
//
// })
router.get('/getAllImage',async (req,res)=>{
    var files = await fs.readdirSync('public');

    files.shift();
    res.json({
        imageList:files
    })
})
module.exports = router;
