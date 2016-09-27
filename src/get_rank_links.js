import request from 'request'
import cheerio from 'cheerio' //Encoding 相关，重要
import iconv from 'iconv-lite'

export default function getLinksAndNextPageWrap(url, pageIndex) {
  console.log(`${url}${pageIndex}`)

  return new Promise((resolve, reject) => {
    request({
      url: `${url}${pageIndex}`,
      encoding: null, //Encoding 相关，重要
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
      }
    }, (err, res, body) => {
      if(err) {
        reject(err)
      }else {
        let analyzeResult = analyzeBody(body)
        resolve(analyzeResult)
      }
    })
  })
}

function analyzeBody(body) {

  var strBody = iconv.decode(body, 'gb2312') //Encoding 相关，重要

  let $ = cheerio.load(strBody,
    { decodeEntities: false }) //Encoding 相关，重要

  let $ATags = $('#ajaxtable tbody:nth-child(2) .t_one td:nth-child(2) a')

  let links = []

  $ATags.each((i, el) => {
    let link = $(el).attr('href')
    let name = $(el).html()

    links.push({link: link, name: name})
  })

  return {
    links: links
  }
}