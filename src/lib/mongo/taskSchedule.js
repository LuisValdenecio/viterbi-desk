import { Schema, model, models } from "mongoose"

const taskSchedule = new Schema({
    timezone:{
        type:String,
        required:true
    },
    day:{
        type:String,
        required:true
    },
    dayPeriod:{
        type:String,
        required:true
    },
    hourAndMinute:{
        type:String,
        required:true
    },

}, {timestamps : true})

const TaskScheduleModel = models.TaskSchedule || model("TaskSchedule",taskSchedule)
export default TaskScheduleModel

