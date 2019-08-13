
var BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'http://118.25.153.205:8090' : 'https://www.chaquanzhong.com';
var LOGO_BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'http://118.25.92.247:8099':'https://account.chaquanzhong.com' ;
export {
    BASE_URL,
    LOGO_BASE_URL,
}