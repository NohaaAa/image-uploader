const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        label: {type: String, required: true},
        image: {type: String, contentType: 'image/png'}
    }, {timestamps: true}
)

module.exports = mongoose.model("images", ImageSchema);
