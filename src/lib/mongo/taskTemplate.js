import { Schema, model, models } from "mongoose"

const taskTemplateSchema = new Schema({
    templateName:{
        type:String,
        required:true
    },
    templateDescription:{
        type:String,
        required:true
    },
}, {timestamps : true})

const TaskTemplateModel = models.TaskTemplate || model("TaskTemplate",taskTemplateSchema)
export default TaskTemplateModel

