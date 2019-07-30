
var BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'https://www.chaquanzhong.com' :
    'http://118.25.153.205:8090';
// var LOCAL_VERSION = '1.0.12'
var LOGO_BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'https://www.chaquanzhong.com' :
    'http://118.25.92.247:8099';
var redirectUrl = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'https://account.chaquanzhong.com' :
    'http://118.25.92.247:8099'
export {
    BASE_URL,
    LOGO_BASE_URL,
    redirectUrl
    // LOCAL_VERSION
}