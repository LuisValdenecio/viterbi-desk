import { Schema, model, models } from "mongoose"

const agentSchema = new Schema({
    agentName:{
        type:String,
        required:true
    },
    channelId:{
        type:String,
        required:true
    },
    action:{
        type:String,
        required:true,
    },
}, {timestamps : true})

const AgentModel = models.Agent || model("Agent",agentSchema)
export default AgentModel

