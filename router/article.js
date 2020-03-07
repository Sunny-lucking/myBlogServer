import Article from "../model/article";
import Tag from "../model/tag"
import formidable from "formidable"
import axios from "axios"
import config from "./../src/config"
import {basename} from 'path'
const express = require("express");
const router = express.Router();
router.post('/deleteArticle',async (req,res)=>{
    let {_id}  = req.body
    // console.log(_id, children);
    let {deletedCount} = await Article.deleteOne({_id})
    if (deletedCount===1){
        return res.json({
            msg:'删除文章成功',
            code:0
        })
    } else{
        return res.json({
            msg:'删除文章失败',
            code:-1
        })
    }


})
router.post('/editOneArticle',async(req,res)=>{
   try {
       const {_id} = req.body;
       const {title,content,summary,username,tag} = req.body;
       console.log(title,content,summary,username,tag);
       console.log(_id);
       let {nModified} = await Article.updateOne({_id},{title,content,summary,username,tag})
       if (nModified===1){
           res.json({
               msg:'修改成功',
               code:0,
           })
       }else{
           res.json({
               msg:'修改失败',
               code:-1
           })
       }
   }catch (e) {
       res.json({
           msg:'编辑错误',
           code:-1
       })
   }

})
router.get('/getArticle',async (req,res)=>{
    const {pageNum,pageSize,keyWord} = req.query;
    // console.log(pageNum, pageSize, keyWord);
    const reg = new RegExp(keyWord,'i')
    // console.log(keyword);
    // console.log(size);
    let articleList = await Article.find({title:{$regex:reg}}).skip((pageNum-1)*pageSize).limit(parseInt(pageSize)).sort({time:-1})
    let count = await Article.find({title:{$regex:reg}}).estimatedDocumentCount()
    if (articleList.length>0){
        res.json({
            code:0,
            msg:'获取文章列表成功',
            articleList,
            count
        })
    } else {
        res.json({
            code:-1,
            msg:'获取文章列表失败',
        })
    }
})

//前端
router.post('/increaseFeelingOfArticle',async (req,res) =>{
    let { articleID ,attrName } = req.body
    console.log(articleID);
    let article = await Article.find({_id:articleID})
    switch (attrName) {
        case 'praise':
            article[0].praise++;
            break;
        case 'applaud':
            article[0].applaud++;
            break;
        case 'caonima':
            article[0].caonima++;
            break;
        case 'angry':
            article[0].angry++;
            break;
    }
    article[0].save();
    if(article){
        return res.json({
            article,
            code:0
        })
    }else{
        return res.json({
            code:-1,
            mgs:"获取失败"
        })
    }
})
router.get('/getArticleOfHot',async (req,res) =>{

    let articleOfHot = await Article.find({}).sort({'pvcount':-1}).limit(6)

    if(articleOfHot){
        return  res.json({
            code:0,
            msg:'获取热门文章成功',
            articleOfHot
        })
    }else{
        res.json({
            code:-1,
            mgs:"获取热门文章失败"
        })
    }
})
router.get('/getArticleOfRandom',async (req,res) =>{

    let articleOfRandom = await Article.aggregate([ { $sample: { size: 6 } } ])
    if(articleOfRandom){
        return  res.json({
            code:0,
            msg:'获取随机文章成功',
            articleOfRandom
        })
    }else{
        res.json({
            code:-1,
            mgs:"获取随机文章失败"
        })
    }
})
router.get('/getArticleOfLatest',async (req,res) =>{
    let articles = await Article.find({}).sort({'time':-1}).limit(10);

    if(articles){
        return res.json({
            articles,
            code:0
        })
    }else{
        res.json({
            code:-1,
            mgs:"获取失败"
        })
    }
})
router.get('/getArticleByTagName',async (req,res) =>{
    let { tagName ,pageIndex, size} = req.query
    console.log("标签明");
    console.log(tagName);
    console.log(pageIndex);
    let index = parseInt(pageIndex)
    let pageSize = parseInt(size)
    let tagname = encodeURI(tagName)
    console.log(tagname);
    console.log(size);
    let article = await Article.find({tag:tagName}).skip((index-1)*pageSize).limit(pageSize).sort({'time':-1})
    let articleOfHot = await Article.find({tag:tagName}).limit(6).sort({'pvcount':-1})
    let count = await Article.find({tag:tagName}).estimatedDocumentCount()
    if(article){
        return res.json({
            article,
            count,
            articleOfHot,
            code:0
        })
    }else{
        res.json({
            code:-1,
            mgs:"获取失败"
        })
    }
})
router.get('/getArticleByKeyWord',async (req,res) =>{
    let { keyWord ,pageIndex, size} = req.query
    console.log(keyWord);
    console.log(pageIndex);
    let index = parseInt(pageIndex)
    let pageSize = parseInt(size)
    let keyword = encodeURI(keyWord)
    const reg = new RegExp(keyWord,'i')
    console.log(keyword);
    console.log(size);
    let article = await Article.find({title:{$regex:reg}}).skip((index-1)*pageSize).limit(pageSize).sort({'time':-1})
    let articleOfHot = await Article.find({title:{$regex:reg}}).limit(6).sort({'pvcount':-1})
    let count = await Article.find({title:{$regex:reg}}).estimatedDocumentCount()
    if(article){
        return res.json({
            article,
            count,
            articleOfHot,
            code:0
        })
    }else{
        return res.json({
            code:-1,
            mgs:"获取失败"
        })
    }
})
router.post('/addArticle',async (req,res) =>{
    console.log("我写文章啦");
    let form = new formidable.IncomingForm();
    form.uploadDir = config.publicPath;
    form.keepExtensions = true
    form.parse(req, async function(err, fields, files) {
        if (err) return err;
        let cover = basename(files.image.path)
        const {title,content,userId,username,time,tag,summary} = fields
        console.log(cover,title, content, userId, username, time, tag, summary);
        // return res.json({fields,cover})
        const result = await Article.create({title,content,cover,userId,username,time:new Date().getTime(),tag,summary})
        if(result){
            let tagInfo = await axios.post('http://localhost:5001/api/tag/addTag',{tagName:tag,articleID:result._id})
            res.json({
                code: 0,
                msg: '发表成功'
            })
        }else{
            res.json({
                code:-1,
                msg: '发表失败'
            })
        }
    });




})
router.get('/getOneArticle',async (req,res) =>{
    let { articleID } = req.query

    let article = await Article.find({_id:articleID})
    article[0].pvcount++;
    article[0].save();
    if(article){
        return res.json({
            article,
            code:0
        })
    }else{
        res.json({
            code:-1,
            mgs:"获取失败"
        })
    }
})
router.get('/getNextAndLast',async (req,res)=>{
    let { articleID } = req.query
    let nextArticle
    let lastArticle
    try {
        nextArticle = await Article.find({'_id':{'$gt':articleID}},{_id:1,title:1}).sort({'_id':1}).limit(1)
        lastArticle = await Article.find({'_id':{'$lt':articleID},},{_id:1,title:1}).sort({'_id':-1}).limit(1)
        console.log(nextArticle);
        console.log(lastArticle);
        return res.json({
            nextArticle:nextArticle,
            lastArticle:lastArticle,
            code:0,
            msg:'获取成功'
        })
    }catch (e) {
        console.log(e);
        return res.json({
            nextArticle:{title:'没有下一篇了',_id:''},
            lastArticle:{title:'没有上一篇了',_id:''},
            code:0,
            msg:'获取成功'
        })
    }



})
router.get('/getCountOfArticle',async (req,res)=>{
   let count = await Article.find({}).estimatedDocumentCount ()
    return res.json({
        count
    })
})

// router.post('/addArticle',async (req,res)=>{
//     // let {bannerName,url}  = req.body
//     // console.log(bannerName,url);
//     // parse a file upload
//     let form = new formidable.IncomingForm();
//     form.uploadDir = config.publicPath;
//     form.keepExtensions = true
//     form.parse(req, async function(err, fields, files) {
//         if (err) return err;
//         // console.log(fields);
//         // console.log(files);
//         let imgUrl = basename(files.image.path)
//         let url = fields.url;
//         let bannerName = fields.bannerName;
//         let newBanner = await Banner.create({imgUrl,url,bannerName})
//         if (newBanner) {
//             return res.json({
//                 newBanner,
//                 fields,
//                 code:0,
//                 msg:'创建新的轮播图成功'
//             })
//         }else{
//             res.json({
//                 msg:'创建新的轮播图失败',
//                 code:-1
//             })
//         }
//         // res.json({
//         //     files
//         // })
//     });
//
//     // let newBanner = await Banner.create({roleName,roleId,roleDesc,children})
//     // if (newBanner){
//     //     res.json({
//     //         msg:'创建角色成功',
//     //         code:0,
//     //         banner:newBanner
//     //     })
//     // } else{
//     //     res.json({
//     //         msg:'创建角色失败',
//     //         code:-1,
//     //     })
//     // }
//
// })
module.exports = router;
