const axios = require("axios"),
    cheerio = require("cheerio"),
    {Link} = require('./Link')

async function findAllLinks(url, linkArr){
    let page = await axios.get(url).catch(err=> { throw err})
    
        const $ = cheerio.load(page.data)
        const anchors = $('a')
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
    let Urls = ["https://edition.cnn.com/","https://timesofindia.indiatimes.com/","https://www.ndtv.com/"]
    const links = []
    for(let i=0;i<Urls.length;i++){
        let url = Urls[i]
        if(url[url.length-1]=='/') url = url.slice(0, url.length-1)
        await findAllLinks(url, links).catch(err=>console.log(err.code))
    }

    // display(links)
}

main()