import EventEmitter from 'events';

export default class InfiniteScroll extends EventEmitter {
    constructor(props) {
        super(props);

        const defaults = {
            load: false, 
            append: '',
            wrapper: '',
            history: false, 
            threshold: 400,
            pagination: [],
        };
        this.page = 0;
        this.contents = {};
        this.options = Object.assign(defaults, props);
        this.loading = false;
        this.$window = $(window);
        this.$document = $(document);
        this.scrollTemp = 0;
        this.currentContent = null;
        this.displayedContents = {};
    }

    up() {
        this.emit('up');
    }

    down() {
        const windowHeight = this.$window.height();
        const documentHeight = this.$document.height();

        if ((documentHeight - windowHeight - this.scrollTop) <= this.options.threshold) {
            if (this.options.load && ! this.loading) {
                this.load();
            }
            this.emit('threshold');
        }
        this.emit('down', this.scrollTop);
    }

    history() {
        if (this.options.history && this.currentContent) {
            document.title = this.currentContent.title;
            history.pushState(null, this.currentContent.title, this.currentContent.url);
        }
        this.emit('history', this.currentContent);
    }

    append(response) {
        $(this.options.wrapper).append(response);
        this.collectContents();
        this.loading = false;
        this.emit('append', this.currentContent);
    }

    request(url) {
        if (! this.loading) {
            this.loading = true;
            $.get(url, (response) => {
                this.emit('request', response);
                if (this.options.append) {
                    this.append(response);
                } else {
                    this.loading = false;
                    this.collectContents();
                }
            });
        }
    }

    load() {
        const pageDetail = this.options.pagination[this.page];
        if (pageDetail) {
            this.page++;
            this.request(pageDetail.url);
        }
        this.emit('load');
    }

    buildContent(el) {
        return {
            el,
            id: el.getAttribute('data-id'),
            url: el.getAttribute('data-url'),
            title: el.getAttribute('data-title'),
        };
    }

    collectContents() {
        document.querySelectorAll(this.options.append).forEach((el) => {
            const id = el.getAttribute('data-id');
            if (! this.contents[id]) {
                this.contents[id] = this.buildContent(el);
            }
        });
    }

    isInView(contentEl) {
        const $contentEl = $(contentEl);
        const offsetTop = $contentEl.offset().top;
        const windowHeight = (this.$window.height() / 2);
        const contentHeight = ($contentEl.height() + offsetTop - windowHeight);

        return (
            (offsetTop - windowHeight) < this.scrollTop &&
            (contentHeight > this.scrollTop)
        );
    }

    setCurrentContent(content) {
        this.currentContent = content;
    }
    
    detectCurrentElement() {
        for (const id in this.contents) {
            if (this.contents.hasOwnProperty(id) &&
                this.isInView(this.contents[id].el)
            ) {
                this.setCurrentContent(this.contents[id]);
                this.history();
                return true;
            }
        }
        return false;
    }

    scrollHandler = () => {
        this.scrollTop = document.documentElement.scrollTop;

        if (this.scrollTemp < this.scrollTop) {
            this.down();
        } else {
            this.up();
        }
        this.scrollTemp = this.scrollTop;

        if (! this.currentContent || ! this.isInView(this.currentContent.el)) {
            this.detectCurrentElement();
        }
    };

    init() {
        this.collectContents();
        this.$window.scroll(this.scrollHandler);
        this.emit('init');
    }
}