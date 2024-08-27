import { Schema, model, models } from "mongoose"

const taskSchema = new Schema({
    taskName:{
        type:String,
        required:true,
        unique: true
    },
    priority : {
        type:String,
        required:true
    },
    status : {
        type:String,
    },
    id: {
        type:String,
        required:true
    },
    agent : { type: Schema.Types.ObjectId, ref: 'AgentModel', required: true },
    schedule : [{ type: Schema.Types.ObjectId, ref: 'TaskScheduleModel', required: true }],
    template : { type: Schema.Types.ObjectId, ref: 'TaskTemplateModel', required: true },
}, {timestamps : true})

const TaskModel = models.Task || model("Task",taskSchema)
export default TaskModel

