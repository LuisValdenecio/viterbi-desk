import { Schema, model, models } from "mongoose"

const personSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    team :  [{ 
        type: Schema.Types.ObjectId, 
        ref: 'TeamModel',
        required:true
    }],
    email: {
        type:String,
        required:true
    },
    role : {
        type:String,
        required:true
    },
    activated : {
        type:Boolean,
        default: false
    }
}, {timestamps : true})

const PersonModel = models.Person || model("Person",personSchema)
export default PersonModel

