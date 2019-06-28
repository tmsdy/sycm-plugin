
var BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'https://www.chaquanzhong.com' :
    'http://118.25.153.205:8090';
var LOCAL_VERSION = '1.0.9'
export {
    BASE_URL,
    LOCAL_VERSION
}