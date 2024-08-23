import { Schema, model, models } from "mongoose"
import AgentModel from "./agents"
import TaskTemplateModel from './taskTemplate'
import TaskScheduleModel from './taskSchedule'

const taskSchema = new Schema({
    taskName:{
        type:String,
        required:true,
        unique: true
    },
    agent : { type: Schema.Types.ObjectId, ref: 'AgentModel', required: true },
    schedule : [{ type: Schema.Types.ObjectId, ref: 'TaskScheduleModel', required: true }],
    template : { type: Schema.Types.ObjectId, ref: 'TaskTemplateModel', required: true },
}, {timestamps : true})

const TaskModel = models.Task || model("Task",taskSchema)
export default TaskModel

