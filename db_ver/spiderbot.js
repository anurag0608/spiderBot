const axios = require("axios"),
    cheerio = require("cheerio"),
    randomUserAgent = require('random-useragent'),
    mongoose = require('mongoose'),
    {Link} = require('./Link'), // link object
    fetch = require('node-fetch'),
    util = require('util'),
    sleep = util.promisify(setTimeout)
/// CONNECT TO DB ///
const Page = require('./models/page')
mongoose.connect('mongodb://localhost:27017/SearchEngine',{
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true 
});
// this function scraps url
// and add connected hyperlinks back to the queue
async function findAllLinks(url, linkArr, currDepth){
    let page = await axios.get(url, 
        { 
            headers:{
                'User-Agent': randomUserAgent.getRandom() 
            }
        }).catch(err=> { throw err})
        const $ = cheerio.load(page.data)
        const anchors = $('a')
        // Getting titles, headings and bold texts //
        const pageTitle = $('title').text();
        let keywords = ""
        if($('meta[name="keywords"]').attr('content')!=undefined) keywords = $('meta[name="keywords"]').attr('content')
        Obj = {
            title: pageTitle,
            keywords: keywords,
            description: $('meta[name="description"]').attr('content'),
            url: url
        }
        Page.create(Obj, (err, new_page)=>{
            if(err){
                console.log(err.code);
            }else{
                console.log("Page Created");
                console.log(new_page)
            }
        })
        let count = 0
        $(anchors).each(function(i, anchor){
            let string = $(anchor).attr('href')
            if(string){
                if(string[0]=='/') string = url + $(anchor).attr('href')
                if(string!='#' && !(string.includes("facebook.com") || string.includes("twitter.com") || string.includes("instagram.com")) ){
                    linkArr.push(new Link(string, currDepth+1))
                    count++
                }
            }
        });
        console.log('Total links found for '+ url +" : "+count)
    
}
const display = (links)=>{
    // display the links
    links.forEach(link=>{
        console.log(link)
    })
}
async function crawlBFS(){
    let Urls = ["https://www.forbes.com/"]
    let pendingLinks = [] // queue
    pendingLinks.push(new Link(Urls[0], 0))
    let visited = []
    let max_depth = 3 // max depth
    // if queue is not empty
    while(pendingLinks.length!=0 ){
            // remove from first
            let linkObj = pendingLinks.shift()
            let currDepth = linkObj.depth
            let url = linkObj.url
            if(url[url.length-1]=='/') url = url.slice(0, url.length-1)

            // craw if the url is not visited
            if(visited[url]!=1 && currDepth < max_depth){
                console.log(`Crawling : ${url} at depth ${currDepth}`)
                await findAllLinks(url, pendingLinks, currDepth)
                .then(()=>{
                    visited[url] = 1 // visit it
                }).catch(err=>{
                    console.log("Error : " + err.code)
                })
            }
            let minWait = 500
            let maxWait = 2000
            // a random delay
            // without delay, websites today will block the ip of the crawler
            let waitTime = Math.floor((Math.random() * maxWait) + minWait)
            await sleep(waitTime)
    }
    display(pendingLinks)
    console.log(visited)
}

// Start crawling 
crawlBFS()