import request from 'request'
import cheerio from 'cheerio'
import fs from 'fs'

export default function downloadTorrent(downloadUrl, name) {
  console.log('download:', downloadUrl)
  return new Promise((resolve, reject) => {
    request({
      url: downloadUrl
    }, (err, res, body) => {
      if(err) {
        console.log(err)
        reject(err)
      }else {
        resolve(analyzeBody(downloadUrl, body, name))
      }
    })
  })
}

async function analyzeBody(downloadUrl, body, name) {
  let $ = cheerio.load(body)

  let reff = $('input[name=reff]').val()
  let ref = $('input[name=ref]').val()

  let regex = /link\.php.*/g

  let url = `${downloadUrl.replace(regex, 'download.php')}?ref=${ref}&reff=${reff}`

  await submitDownloadReq(url, name)
}


function submitDownloadReq(downloadUrl, name) {

  let regex = /\//g

  let newName = name.replace(regex, '-')

  console.log(downloadUrl)

  new Promise((resolve, reject) => {
    request({
      url: downloadUrl
    }, (err, res, body) => {
      if(err) {
        reject(err)
      }else {
        fs.writeFileSync(`./result/${newName}.torrent`, body)
      }
    })
  })
}