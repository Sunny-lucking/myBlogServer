import mongoose from 'mongoose'
const Schema = mongoose.Schema
const AlbumsSchema=new Schema({
    userId:{
        type:String,
        require:true,
    },
    url:{
        type: String,
        require: true
    }
})

export default mongoose.model('Albums',AlbumsSchema)
