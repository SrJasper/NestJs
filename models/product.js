const {model, Schema} = require("mongoose")


const product = new Schema({
    nome: String,
    value: Number,
    img: String,
    category: String,
})

const productModel = model("produto", product)

module.exports = productModel