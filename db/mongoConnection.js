const mongoose = require("mongoose")


async function conn(){
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("Conectado com o banco de dados!!")
    } catch (error) {
        console.log(error)
    }
}

module.exports = conn