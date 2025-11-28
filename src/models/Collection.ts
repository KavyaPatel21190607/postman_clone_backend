import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    items: [
        {
            name: String,
            url: String,
            method: String,
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
            body: String,
        },
    ],
}, {
    timestamps: true,
    collection: 'collection'
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
