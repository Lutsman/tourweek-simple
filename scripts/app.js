$(function () {
   // datepicker
    (function () {
        var $datepicker = $('[datepicker]');
        var options = {
            placeholder: '',
            lang: 'ru-RU',
        };

        $datepicker.datepicker(options);
    })();

    // navbar
    (function () {
        var $navbar = $('.uk-navbar');
        var $navContainer = $('.uk-navbar-container');
        var $body = $('body');
        var $overlay = $('<div class="tm-navbar-overlay"></div>');
        var activeNavClassName = 'tm-navbar-active';
        var activeTogglerClassName= 'uk-active';
        var relativePosClassName = 'uk-position-relative';

        $navbar.on({
            beforeshow: function (e) {
                var $toggler = $(e.target).parent();
                $toggler.addClass(activeTogglerClassName);
                $navContainer.addClass(activeNavClassName);
                $body.addClass(relativePosClassName);
                $overlay
                    .appendTo($body)
                    .fadeIn(200);
            },
            beforehide: function (e) {
                var $toggler = $(e.target).parent();
                $toggler.removeClass(activeTogglerClassName);
                $navContainer.removeClass(activeNavClassName);
                $overlay.fadeOut(200, () => {
                    $overlay.remove();
                    $body.removeClass(relativePosClassName);
                });
            },
        });
    })();

    // scroller
    (function () {
        new ScrollToAnchor({
            listenedBlock: '.js-search-start',
        });
    })();

    // toggler
    (function () {
        var $togglers = $('[uk-toggle]');

        $togglers.each(function () {
            var $toggler = $(this);
            var $target = $($toggler.attr('href'));
            var activeClassName = 'uk-toggle-active';

            $target.on({
                'shown': function () {
                    $toggler.addClass(activeClassName);
                },
                'hidden': function () {
                    $toggler.removeClass(activeClassName);
                },
            });
        });

    })();

    //social likes
    (function () {
        var $wrappers = $('.social-likes-wrapper');
        var options = {
            zeroes: 'yes',
        };

        $wrappers.socialLikes(options);
    })();
});