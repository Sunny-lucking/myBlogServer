import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ArticleSchema=new Schema({
    title:{
        type: String,
        require: true,
    },
    content:{
        type: String,
        require: true,
    },
    summary:{
        type:String,
        require:true,
        default:''
    },
    cover:{
        type: String,
        require: true
    },
    userId:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    time:{
        type: Date,
        require:true
    },
    pvcount:{
        type:Number,
        require:false,
        default:0
    },
    praise:{
        type:Number,
        require:false,
        default: 0
    },
    applaud:{
        type:Number,
        require:false,
        default:0
    },
    caonima:{
        type:Number,
        require:false,
        default:0
    },
    angry:{
        type:Number,
        require:false,
        default:0
    },
    tag:{
        type:String,
        require:true,
        default:"全部"
    }
})

export default mongoose.model('Article',ArticleSchema)
