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
    googleToken :  { type: Schema.Types.ObjectId, ref: 'GoogleTokenModel' },
    discordToken :  { type: Schema.Types.ObjectId, ref: 'DiscordTokenModel' },
}, {timestamps : true})

const ChannelModel = models.Channel || model("Channel",channelSchema)
export default ChannelModel