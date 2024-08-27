import { Schema, model, models } from "mongoose"

const agentSchema = new Schema({
    agentName:{
        type:String,
        required:true
    },
    channel :  { 
        type: Schema.Types.ObjectId, 
        ref: 'ChannelModel',
        required:true
    },
    description: {
        type:String,
    },
    status : {
        type:String,
    }
}, {timestamps : true})

const AgentModel = models.Agent || model("Agent",agentSchema)
export default AgentModel

