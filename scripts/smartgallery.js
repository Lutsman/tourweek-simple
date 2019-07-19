class SmartGallery {

    constructor(options = {}) {

        //Options section
        this.photoHolderSelector = options.gallery || '.tm-grid-best-photo';
        this.photoCollectionClass = options.imageContainer || 'tm-photo-img-cover';
        this.responsiveWidth = options.responsiveBreakpoint || 640;
        this.horizontalMargin = options.horizontalMargin || 3;

        //Inner classes, change only in case of conflicts
        this.desktopModeWrapperClass = 'tm-photo-desktop';
        this.photoCollectionActiveClass = 'tm-photo-img-wrap';
        this.responsiveModeWrapperClass = 'tm-photo-responsive';
        this.responsivePhotoCollectionActiveClass = 'tm-photo-img-responsive';
        this.rowMarksClass = 'tm-row-start';

        this.indexRows = [];
        this.rowWidths = [];
        this.photoWidths = [];

        this.loadCounter = 0;
        this.delayedPhotos = [];

        this.init();
    }

    init() {

        this.photoHolder = $(this.photoHolderSelector);
        this.photoCollectionSelector = '.' + this.photoCollectionClass;
        this.photoCollection = this.photoHolder.find(this.photoCollectionSelector);

        this.delayedPhotos = this.getDelayed();

        this.loadCounter = this.delayedPhotos.length;

        this._handleDelayedLoad = this.handleDelayedLoad.bind(this);

        for(let i = 0; i < this.delayedPhotos.length; i++) {

            $(this.delayedPhotos[i]).find('img').on('load', this._handleDelayedLoad);
        }

        this.render();

        this.makeResponsive();

        this.markRows(this.rowMarksClass);

        this.photoRowStart = this.photoHolder.find(this.photoCollectionSelector + '.'+ this.rowMarksClass);

        this.resizePhoto();

        this.addGlobalListeners();

        setTimeout(()=> {
            if(this.loadCounter) this.reInit();
        }, 10000);
    }

    handleDelayedLoad () {
    this.loadCounter--;

    if(this.loadCounter <= 0) this.reInit();
}

    getDelayed() {

        let delayedPhotos = [];

        this.photoCollection.each(function () {

            if($(this).find('img').width() === 0) {
                delayedPhotos.push($(this));
            }
        });

        return delayedPhotos;
    }

    addGlobalListeners() {
        this._reInit = this.reInit.bind(this);
        $(window).on('resize', this._reInit);
    }

    render() {
        this.desctopHolder = $('<div></div>');
        this.desctopHolder.addClass(this.desktopModeWrapperClass);
        this.photoHolder.prepend(this.desctopHolder);

        this.responsiveHolder = $('<div></div>');
        this.responsiveHolder.addClass(this.responsiveModeWrapperClass);
        this.photoHolder.prepend(this.responsiveHolder);

        this.columnOne = $('<div></div>');
        this.columnTwo = $('<div></div>');

        this.photoCollection.filter(':even').clone().appendTo(this.columnOne);
        this.photoCollection.filter(':odd').clone().appendTo(this.columnTwo);

        this.responsiveHolder.append(this.columnOne);
        this.responsiveHolder.append(this.columnTwo);

        this.responsiveHolder.find(this.photoCollectionSelector).removeClass(this.photoCollectionClass).addClass(this.responsivePhotoCollectionActiveClass);

        this.photoCollection.appendTo(this.desctopHolder);
    }

    resizePhoto() {
        this.holderWidth = this.photoHolder.width();

        this.photoRowStart.each((index) => {
            this.indexRows.push(this.photoRowStart.eq(index).index());
        });

        for (let j = 0; j < this.indexRows.length; j++) {

            let firstPhoto = this.indexRows[j];
            let lastPhoto = this.indexRows[j + 1] || this.photoCollection.length;

            let lengthsPhoto = 0;
            const countPhoto = lastPhoto - firstPhoto;
            const marginsWidth = countPhoto * this.horizontalMargin;

            for (let i = firstPhoto; i < lastPhoto; i++) {
                lengthsPhoto += this.photoCollection.eq(i).width();
            }

            this.rowWidths.push(lengthsPhoto);

            const widthCoefficient = (this.holderWidth - marginsWidth) / lengthsPhoto;

            for (let i = firstPhoto; i < lastPhoto; i++) {
                this.photoWidths.push(this.photoCollection.eq(i).width());
                const newWidth = this.photoWidths[i] * widthCoefficient;
                this.photoCollection.eq(i).removeClass(this.photoCollectionClass);
                this.photoCollection.eq(i).addClass(this.photoCollectionActiveClass);
                this.photoCollection.eq(i).width(newWidth);
            }
        }
    }

    reInit() {
        this.resetAll();

        this.makeResponsive();

        this.resizePhoto();

    }

    makeResponsive() {
        if (this.checkResponsive(this.responsiveWidth)) {
            this.desctopHolder.hide();
            this.responsiveHolder.show();
        }
        else {
            this.desctopHolder.show();
            this.responsiveHolder.hide();
        }
    }

    checkResponsive(breakpoint) {
        return window.innerWidth < breakpoint;
    }

    markRows(markClass) {
        let lastTop = -1;
        let currentTop = 0;
        let length = this.photoCollection.length;
        this.photoCollection.each(function (index) {
            if(index === length - 1) return;
            currentTop = $(this).position().top;
            if (currentTop !== lastTop) {
                $(this).addClass(markClass);
                lastTop = currentTop;
            }
        })
    }

    resetAll() {

        this.indexRows = [];
        this.rowWidths = [];
        this.photoWidths = [];

        this.photoCollection.attr('style','');
        this.photoCollection.removeClass(this.photoCollectionActiveClass);
        this.photoCollection.addClass(this.photoCollectionClass);
        this.photoCollection.removeClass(this.rowMarksClass);

        this.markRows(this.rowMarksClass);
        this.photoRowStart = this.photoHolder.find(this.photoCollectionSelector + '.'+ this.rowMarksClass);
    }
}

$.fn.smartGallery = function(options = {}) {
    $(this).each(function(){
        const el = this;

        options.gallery = el;

        el.smartGallery = new SmartGallery(options);
    });
};