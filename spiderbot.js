const axios = require("axios"),
    cheerio = require("cheerio"),
    {Link} = require('./Link')

async function findAllLinks(url, linkArr){
    let page = await axios.get(url).catch(err=> { throw err})
        const $ = cheerio.load(page.data)
        const anchors = $('a')
        // Getting titles, headings and bold texts //
        const pageTitle = $('title');
        let keywords = []
        
        if($('meta[name="keywords"]').attr('content')!=undefined) keywords = $('meta[name="keywords"]').attr('content').split(',')

        let meta = {
            keywords,
            description : $('meta[name="description"]').attr('content')
        }
        let index = {
            title: $('title').text(),
            meta
        }
        console.log(index)
        
        let count = 0
        $(anchors).each(function(i, anchor){
            let string = $(anchor).attr('href')
            if(string){
                if(string[0]=='/') string = url + $(anchor).attr('href')
                if(string!='#'){
                    linkArr.push(new Link(string))
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
async function main(){
    let Urls = ["https://in.bookmyshow.com/","https://www.pvrcinemas.com/","https://www.blu-ray.com/","https://www.youtube.com/"]
    let links = []
    for(let i=0;i<Urls.length;i++){
        let url = Urls[i]
        if(url[url.length-1]=='/') url = url.slice(0, url.length-1)
        await findAllLinks(url, links).catch(err=>console.log("Error : " + err))
    }

    // display(links)
}

main()