import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    url: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    params: [
        {
            key: String,
            value: String,
            enabled: Boolean,
        },
    ],
    headers: [
        {
            key: String,
            value: String,
            enabled: Boolean,
        },
    ],
    body: {
        type: String,
    },
    response: {
        status: Number,
        statusText: String,
        headers: Object,
        data: mongoose.Schema.Types.Mixed,
        responseTime: Number,
    },
}, {
    timestamps: true,
    collection: 'history'
});

const History = mongoose.model('History', historySchema);

export default History;
