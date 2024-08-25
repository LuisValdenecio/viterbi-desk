import { Schema, model, models } from "mongoose"

const tokenSchema = new Schema({
    access_token:{
        type:String,
        required:true
    },
    token_type:{
        type:String,
        required:true
    }
}, {timestamps : true})

const DiscordTokenModel = models.DiscordToken || model("DiscordToken",tokenSchema)
export default DiscordTokenModel

