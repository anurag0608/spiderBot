const mongoose = require('mongoose')
const pageSchema = new mongoose.Schema({
    title: String,
    keywords: {
        type: String,
        index: true
    },
    description: {
        type: String,
        index:  true
    },
    url: String,
})
pageSchema.index({keywords: 'text', description:'text'})
module.exports  = mongoose.model('Page',pageSchema)