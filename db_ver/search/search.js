const mongoose = require('mongoose')
Page = require('../models/page')
mongoose.connect('mongodb://localhost:27017/SearchEngine',{
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true 
});
async function searchQuery(searchString){
    searchString = "\""+searchString+"\""
    const query = { $text : {$search : searchString }}
    Page.find(query, (err, res)=>{
        if(err){
            console.log(err.code)
        }else{
            console.log(res)
            mongoose.disconnect();
        }
    })
}
searchQuery("vaccine")