import getLocation from './GetLocation.js'

export async function generateAwin(link, storeId) {
    const url = 'https://www.awin1.com/cread.php?awinmid=' + storeId + '&awinaffid=' + process.env.AWIN_ID + '&ued=' + encodeURI(link)

    return await getLocation(url)
}

export default generateAwin