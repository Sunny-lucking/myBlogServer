import Comment from "../model/comment";

const express = require("express");
const router = express.Router();

// router.get('/getCount',async (req,res)=>{
//     let comment  = await Comment.find({})
//
//     let count = 0;
//     count += comment.length
//     comment.forEach(item=>{
//         count += item.discuss.subDiscuss.length
//     })
//
//     return res.json({
//         msg:'获取用户数成功',
//         code:0,
//         count,
//     })
// })
router.post('/addComment',async (req,res) =>{
    console.log("添加评论接口");
    let { articleID,newDiscuss,time} = req.body
    console.log(articleID);
    let comment = await Comment.create({articleID,discuss:newDiscuss,time})
    // let comments = await Comment.find({articleID:articleID})
    if(comment){
        return res.json({
            code:0,
            msg:'创建新的评论成功'
        })
    }else{
        return res.json({
            code:-1,
            msg:'创建失败'
        })
    }

})
router.get('/getComment',async (req,res) =>{
    let { articleID }= req.query
    console.log("查找评论");
    let comments = await Comment.find({articleID})
    console.log(comments);
    if (comments.length){
        return res.json({
            code:0,
            comments
        })
    }else{
        return res.json({
            code: -1,
            msg: '没有标签'
        })
    }

})
router.post('/addRecall',async (req,res) =>{
    let {articleID,targetName,selfName,inputOfRecall,time,_id,selfId} = req.body
    console.log(articleID, targetName, selfName, inputOfRecall, time,_id);
    let comments = await Comment.find({_id:_id})
    console.log(comments[0]);

    comments[0].discuss.subDiscuss.push({
        targetName,
        selfName,
        time,
        inputOfRecall,
        selfId
    })
    let newDiscuss = comments[0].discuss
    console.log(newDiscuss);
    let newComment = await Comment.updateOne({_id:_id},{discuss:newDiscuss})
    console.log(await Comment.find({_id: _id}));
    return res.json({
        msg:'收到了没',
        newComment:newComment
    })

})
module.exports = router;
