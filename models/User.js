import mongoose from "mongoose";

const User = mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    fullname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    is_active: {
        type: Boolean,
        required: false,
        default: true
    },
    role: [{
        type: String,
        required: false,
    }],
    update_time: {
        type: Date,
        required: false,
    },
    created_time: {
        type: Date,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    tenant: {
        type: String,
        required: false,
    },
    permissions: {
        scope: [
            {
                nameScope: {
                    type: String,
                    required: false,
                },
                scopeDetail: [
                    {
                        type: String,
                        required: false,
                    }
                ]
            }
        ],
        roleView: [
            {
                type: String,
                required: false
            }
        ]
    }
}, {
    versionKey: false
})

export default mongoose.model('User', User)
