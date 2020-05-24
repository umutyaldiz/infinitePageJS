import InfiniteManager from './InfiniteManager';

const infiniteManager = new InfiniteManager({
    wrapper: '.itemWrapper',
    append: '.item',
    ID: 11111, // current page id, seçili sayfa id
    apiUrl: "/inifinite-page/",
    data: [{
        fullUrl: "https://umutyaldiz.com/1",
        itemID: 11111,
        title: "News 1",
        url: "/1"
    },
    {
        fullUrl: "https://umutyaldiz.com/2",
        itemID: 11112,
        title: "News 2",
        url: "/2"
    }]
});