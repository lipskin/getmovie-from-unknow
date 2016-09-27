import getLinksAndNextPage from './get_rank_links'
import * as getMovies from './get_movies'

const domain = 'http://cl.dgkiz.com/'
const listPageUrl = 'thread0806.php?fid=2&search=&page='
const startPageIndex = '2'
const endPageIndex = '20'

init();

async function init() {

  getMovies.prepareFolder()

  await getLinksAndResolve(domain, listPageUrl, startPageIndex)

}


async function getLinksAndResolve(domain, listPageUrl, startPageIndex) {

  let url = `${domain}${listPageUrl}`;

  for(var index = startPageIndex; index <= endPageIndex; index++) {
    console.log(`Try to get in [${index}] page`)
    let result = await getLinksAndNextPage(url, index)
    await resolveEachLink(result.links)
  }
}

async function resolveEachLink(links) {
  for (let i = 0; i < links.length; i++) {
    try{
      await getMovies.fetchMovie(`${domain}${links[i].link}`, links[i].name)
    }catch(e) {
      console.log(e)
    }
  }
}