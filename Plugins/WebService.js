const { URL } = require('url');
var rp = require('request-promise');
const jsdom = require('jsdom');

const TIMEOUT = 10000;
const USERAGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36';

class WebService {

    constructor() {
    }

    /**
     * Checks if the string provided is a URL.
     * @param url
     * @return {boolean}
     */
    isValidUrl(url) {
        let u = url.toLowerCase();
        return u.startsWith('http://') || u.startsWith('https://');
    }

    /**
     * Returns the hostname part of a URL
     * @param url
     * @return {string}
     */
    getHostName(url) {
        try {
            let myUrl = new URL(url);
            return myUrl.hostname;
        } catch (e) {}
    }


    /**
     * Downloads a web page an returns a promise containing the HTML body
     * @param url
     * @return {promise}
     */
    download(url) {
        return rp({
            url: url,
            timeout: TIMEOUT,
            headers: {'User-Agent': USERAGENT}
        });
    }

    /**
     * Downloads a web page and returns a promise containing the web page's title
     * @param url
     * @returns {promise}
     */
    downloadTitle(url) {
        return this.download(url).then(function (html) {
            const {JSDOM} = jsdom;
            const dom = new JSDOM(html);
            const $ = (require('jquery'))(dom.window);
            return $("title").text();
        });
    }

    jquery(html) {
        const {JSDOM} = jsdom;
        const dom = new JSDOM(html);
        const $ = (require('jquery'))(dom.window);

        return $;
    }
}

export default WebService;