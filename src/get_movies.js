import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'
import iconv from 'iconv-lite'
import downloadTorrent from './download_torrent.js'

export function fetchMovie(movieUrl, name) {

  console.info('Fetching: ', movieUrl)

  return new Promise((resolve, reject) => {
    request({
      url: movieUrl,
      encoding: null, //Encoding 相关，重要
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
      }
    }, (err, res, body) => {

      if(err) {
        reject(err)
        console.info('Fetch failed:', err)
      }else {
        resolve(analyzeBody(body, name))
      }
    })
  })
}


async function analyzeBody (body, name) {

  var strBody = iconv.decode(body, 'gb2312') //Encoding 相关，重要

  let $ = cheerio.load(strBody, {decodeEntities: false})

  let $downloadTag = $('.tpc_content a')

  let result = []

  $downloadTag.each((i, el) => {
    let itemResult = {}

    itemResult.title = name

    itemResult.link = $(el).html()

    if(itemResult.link.includes('rmdown')) {
      result.push(itemResult)
    }
  })

  // console.log(result)

  for(var i = 0; i<result.length; i++){
    await downloadTorrent(result[i].link, result[i].title, i)
  }

}

export function prepareFolder() {
  if(fileExists(`./result/`)) {
    deleteFolderRecursive(`./result/`)
  }
  fs.mkdirSync(`./result/`)
}

function fileExists(filename){
  try{
    fs.accessSync(filename)
    return true;
  }catch(e){
    return false;
  }
}

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file) {
      var curPath = path + "/" + file
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}