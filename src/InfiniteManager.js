import InfiniteScroll from './InfiniteScroll';

export default class InfiniteManager {
    constructor(props) {
        const defaults = {
            wrapper:"",
            append:"",
            ID : 0,
            apiUrl : "",
            data:[]
        };
        this.options = Object.assign(defaults, props);
        this.init();
    }

    getNewsId() {
        return this.options.ID;
    }

    getUrl() {
        return this.options.apiUrl;
    }

    onLoad() {
        //sayfa sayım google analytics kodu -- page count add datalayer GA
        // dataLayer.push({ 'infiniteLoadPage': this.page });
    }

    onHistory = (content) => {
        if (this.getNewsId() != content.id) {
            //tracker codes - izleme kodları
        }
    }

    getNewsCollections() {
        const _this = this;
        let isNextNews = false;
        const collections = [];

        for (let i = 0,length = this.options.data.length; i < length; i++) {
            const news = this.options.data[i];
            if (isNextNews) {
                let url = this.getUrl() + `${news.itemID}`;
                collections.push({
                    url: url,
                    id: news.itemID,
                });
            }
            if (this.getNewsId() == news.itemID) {
                isNextNews = true;
            }
        }
        return collections;
    }

    init() {
        const infiniteInstance = new InfiniteScroll({
            load: true,
            history: true,
            wrapper: this.options.wrapper,
            append: this.options.append,
            threshold: 1800,
            pagination: this.getNewsCollections()
        });
        infiniteInstance.init();
        infiniteInstance.on('load', this.onLoad);
        infiniteInstance.on('history', this.onHistory);

        $(window).bind('popstate', function (e) {
            if ($('body').hasClass('historyPushed')) { // geri tuşuna basıldığında infinite olmuş sayfaya değil ondan önceki sayfaya dönmeyi sağlayan yapı.
                window.location.href = '/';
            }
        });
    }
}
