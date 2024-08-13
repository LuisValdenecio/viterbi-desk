import { Schema, model, models } from "mongoose"

const channelSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    provider: {
        type:String,
        required:true
    },
}, {timestamps : true})

const ChannelModel = models.Channel || model("Channel",channelSchema)
export default ChannelModel