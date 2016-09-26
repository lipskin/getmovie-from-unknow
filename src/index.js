import request from 'request'

import getLinksAndNextPage from './get_rank_links'
import * as LoginManager from './login'
import * as getMovies from './get_movies'

const domain = 'http://cl.dgkiz.com/'
const listPageUrl = 'thread0806.php'
const startListPageQuery = '?fid=2&search=&page=2'

init();

async function init() {

  getMovies.prepareFolder()

  await getLinksAndResolve(domain, listPageUrl, startListPageQuery)

  await LoginManager.logout()

  console.info('Logout success')

}


async function getLinksAndResolve(domain, listPageUrl, listPageQuery) {

  let url = `${domain}${listPageUrl}${listPageQuery}`;

  console.log('Try to get link from this URL:', url)

  let result = await getLinksAndNextPage(url)

  // await resolveEachLink(result.links)

  // if(result.nextPageQuery != null) {
  //   await getLinksAndResolve(listPageUrl, result.nextPageQuery)
  // }
}

async function resolveEachLink(links) {
  for (let i = 0; i < links.length; i++) {
    try{
      await getMovies.fetchMovie(`${domain}${links[i]}`)
    }catch(e) {
      console.log('skip error link')
    }
  }
}