import request from 'request'
import cheerio from 'cheerio'
import fs from 'fs'

export default function downloadTorrent(downloadUrl, name, index) {
  console.log('download:', downloadUrl)
  return new Promise((resolve, reject) => {
    request({
      url: downloadUrl
    }, (err, res, body) => {
      if(err) {
        console.log(err)
        reject(err)
      }else {
        resolve(analyzeBody(downloadUrl, body, name, index))
      }
    })
  })
}

async function analyzeBody(downloadUrl, body, name, index) {
  let $ = cheerio.load(body)

  let reff = $('input[name=reff]').val()
  let ref = $('input[name=ref]').val()

  let regex = /link\.php.*/g

  let url = `${downloadUrl.replace(regex, 'download.php')}?ref=${ref}&reff=${reff}`

  await submitDownloadReq(url, name, index)
}


function submitDownloadReq(downloadUrl, name, index) {

  let regex = /\//g

  let newName = name.replace(regex, '-')

  new Promise((resolve, reject) => {
    request({
      url: downloadUrl
    }, (err, res, body) => {
      if(err) {
        reject(err)
      }else {
        fs.writeFileSync(`./result/${newName}[${index}].torrent`, body)
      }
    })
  })
}