import mongoose from 'mongoose'
const Schema = mongoose.Schema
const CommentSchema=new Schema({
    articleID:{
        type:String,
        require:true,
    },
    discuss:{
        type: Object,
        require: false,
        default: {
            username:'',
            articleID: '',
            inputOfComment:'',
            userId:'',
            cover:'',
            subDiscuss:[]
        }
    },
    time:{
        type:Date,
        require:true
    }
})

export default mongoose.model('Comment',CommentSchema)
