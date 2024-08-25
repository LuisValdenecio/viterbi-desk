import { Schema, model, models } from "mongoose"

const tokenSchema = new Schema({
    access_token:{
        type:String,
        required:true
    },
    refresh_token:{
        type:String,
        required:true
    },
    scope:{
        type:String,
        required:true,
    },
}, {timestamps : true})

const GoogleTokenModel = models.GoogleToken || model("GoogleToken",tokenSchema)
export default GoogleTokenModel

