import request from 'request'
import cheerio from 'cheerio' //Encoding 相关，重要
import iconv from 'iconv-lite'

export default function getLinksAndNextPageWrap(url) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
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

  // let isLastPage = $('.pages a').last().hasClass('cur')

  let nextPageQuery = null

  $ATags.each((i, el) => {
    let link = $(el).attr('href')
    let name = $(el).html()
    console.log(link, name.toString(16))
  })

  // if(!isLastPage) {
  //   nextPageQuery = $('.pages a').eq(-2).attr('href')
  // }

  return {
    links: links,
    nextPageQuery: nextPageQuery
  }
}