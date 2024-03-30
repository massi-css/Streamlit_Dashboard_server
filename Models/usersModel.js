import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
    },
    updatefrequency:{
        type: Number,
        default:10,
        required: true
    },
    recieveNotification:{
        perEmail:{
            type: Boolean,
            default: true,
            required: true
        },
        perSMS:{
            type: Boolean,
            default: true,
            required: true
        },
    }
})

const user = mongoose.model('user', Schema);

export default user;