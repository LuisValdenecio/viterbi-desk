import { Schema, model, models } from "mongoose"

const agentSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
}, {timestamps : true})

const AgentModel = models.Agent || model("Agent",agentSchema)
export default AgentModel