import { Schema, model, models } from "mongoose"

const contactSchema = new Schema({
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

const ContactModel = models.Contact || model("Contact",contactSchema)
export default ContactModel