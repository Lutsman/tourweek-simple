class SmartGallery {

    constructor(options) {

        this.photoHolder = $('.tm-grid-best-photo');
        this.photoCollection = this.photoHolder.find('.tm-photo-img-cover');
        this.responsiveWidth = 640;

        this.indexRows = [];
        this.rowWidths = [];
        this.photoWidths = [];

        this.init();
    }

    init() {

        this.desctopHolder = $('<div></div>');
        this.desctopHolder.addClass('tm-photo-desctop');
        this.photoHolder.append(this.desctopHolder);

        this.responsiveHolder = $('<div></div>');
        this.responsiveHolder.addClass('tm-photo-responsive');
        this.photoHolder.append(this.responsiveHolder);

        this.columnOne = $('<div></div>');;
        this.columnTwo = $('<div></div>');;

        this.photoCollection.filter(':even').clone().appendTo(this.columnOne);
        this.photoCollection.filter(':odd').clone().appendTo(this.columnTwo);

        this.responsiveHolder.append(this.columnOne);
        this.responsiveHolder.append(this.columnTwo);

        this.responsiveHolder.find('.tm-photo-img-cover').removeClass('tm-photo-img-cover').addClass('tm-photo-img-responsive');

        this.photoCollection.appendTo(this.desctopHolder);

        this.markRows('tm-row-start');

        this.photoRowStart = this.photoHolder.find('.tm-photo-img-cover.tm-row-start');

        this.render();

        this.makeResponsive();

        $(window).on('resize', this.reInit.bind(this));
    }

    render() {
        this.holderWidth = this.photoHolder.width();

        this.photoRowStart.each((index) => {
            this.indexRows.push(this.photoRowStart.eq(index).index());
        });

        for (let j = 0; j < this.indexRows.length; j++) {

            let firstPhoto = this.indexRows[j];
            let lastPhoto = this.indexRows[j + 1] || this.photoCollection.length;

            let lengthsPhoto = 0;
            const countPhoto = lastPhoto - firstPhoto;
            const marginsWidth = countPhoto * 3; //if margin 3px;

            for (let i = firstPhoto; i < lastPhoto; i++) {
                lengthsPhoto += this.photoCollection.eq(i).width();
            }

            this.rowWidths.push(lengthsPhoto);

            const widthCoefficient = (this.holderWidth - marginsWidth) / lengthsPhoto;

            for (let i = firstPhoto; i < lastPhoto; i++) {
                this.photoWidths.push(this.photoCollection.eq(i).width());
                const newWidth = this.photoWidths[i] * widthCoefficient;
                this.photoCollection.eq(i).removeClass('tm-photo-img-cover');
                this.photoCollection.eq(i).addClass('tm-photo-img-wrap');
                this.photoCollection.eq(i).width(newWidth);
            }
        }
    }

    reInit() {
        this.resetAll();

        this.render();

        this.makeResponsive();
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
        this.photoCollection.each(function () {
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
        this.photoCollection.removeClass('tm-photo-img-wrap');
        this.photoCollection.addClass('tm-photo-img-cover');
        this.photoCollection.removeClass('tm-row-start');

        this.markRows('tm-row-start');

        this.photoRowStart = this.photoHolder.find('.tm-photo-img-cover.tm-row-start');
    }
}