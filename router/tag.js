import Tag from "../model/tag";

const express = require("express");
const router = express.Router();

router.get('/getAllTags',async (req,res)=>{

    let tags = await Tag.find({})
    if (tags.length>0){
        res.json({
            code:0,
            msg:'获取标签列表成功',
            tags,
        })
    } else {
        res.json({
            code:-1,
            msg:'获取标签列表失败',
        })
    }
})

router.post('/addTag',async (req,res) =>{
    console.log("添加标签接口");
    let { articleID,tagName} = req.body
    console.log(articleID, tagName);
    let tag = await Tag.find({tagName:tagName})
    console.log(tag);
    if(tag.length){
        tag[0].articleIDs.push(articleID)
        tag[0].save();
        console.log('文章已添加标签');
        return res.json({
            code:0,
            msg:'文章已添加标签'
        })
    }else{
        let TempTag = Tag.create({tagName,articleIDs:[articleID]})
        if (TempTag) {
            console.log('添加新标签成功');
            res.json({
                code:0,
                msg:'添加新标签成功'
            })
        }else {
            res.json({
                code: -1,
                msg:'添加新标签失败'
            })

        }
    }

})

module.exports = router;
