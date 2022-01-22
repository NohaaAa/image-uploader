const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const ProductSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        desc: {type: String, required: true},
        img: {type: String, required: true},
        categories: {type:Array},
        size: {type: String},
        color: {type: String},
        price: {type: String, required: true},
    }, {timestamps: true}
)

module.exports = mongoose.model("product", ProductSchema);