const { error } = require('console')
const mongoose = require('mongoose')

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URL).then(()=>{console.log('DB connected')}).catch(()=>{console.log(error)})
}

connectDB()

module.exports = connectDB