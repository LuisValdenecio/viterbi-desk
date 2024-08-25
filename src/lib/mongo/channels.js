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
    token :  { type: Schema.Types.ObjectId, ref: 'GoogleTokenModel' },
}, {timestamps : true})

const ChannelModel = models.Channel || model("Channel",channelSchema)
export default ChannelModel