import { Schema, model, models } from "mongoose"

const teamSchema = new Schema({
    teamName:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true
    },
    channel :  [{ 
        type: Schema.Types.ObjectId, 
        ref: 'ChannelModel',
        required:true
    }],
    description: {
        type:String,
    },
    status : {
        type:String,
    }
}, {timestamps : true})

const TeamModel = models.Team || model("Team",teamSchema)
export default TeamModel

