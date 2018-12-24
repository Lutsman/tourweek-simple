$(function () {
    "use strict";
    // datepicker
    (function () {
        var $datepicker = $('[datepicker]');
        var options = {
            placeholder: '',
            lang: 'ru-RU'
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
        var activeTogglerClassName = 'uk-active';
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
                $overlay.fadeOut(200, function () {
                    $overlay.remove();
                    $body.removeClass(relativePosClassName);
                });
            }
        });
    })();

    // scroller
    (function () {
        /* jshint ignore:start*/
        new ScrollToAnchor({
            listenedBlock: '.js-search-start'
        });
        /* jshint ignore:end */
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
                }
            });
        });

    })();

    //social likes
    (function () {
        var $wrappers = $('.social-likes-wrapper');
        var options = {
            zeroes: 'yes'
        };

        $wrappers.socialLikes(options);
    })();

    //tourist dictionary
    (function () {
        var $filterContainer = $('.tm-dictionary-links');
        var $words = $filterContainer.nextAll();
        var activeClass = 'tm-active';
        var $activeFilter = getDefaultFilter($filterContainer, activeClass);

        filterWords($words, $activeFilter);
        $filterContainer.on('click', 'a', clickHandler);

        function clickHandler(e) {
            e.preventDefault();
            var $filter = $(e.target);

            if ($filter.is($activeFilter)) {
                $activeFilter.removeClass(activeClass);
                $activeFilter = null;
                $words.show();
            } else {
                if ($activeFilter) {
                    $activeFilter.removeClass(activeClass);
                }

                $filter.addClass(activeClass);
                $activeFilter = $filter;
                filterWords($words, $activeFilter);
            }
        }

        function getFirstLetter($el) {
            return $el.text()[0].toLowerCase();
        }

        function getDefaultFilter($container, className) {
            var $activeFilters = $container.find('.' + className);
            var $currActiveFilter = $activeFilters.eq(0);

            $activeFilters.not($currActiveFilter).removeClass(className);

            return $currActiveFilter.length ? $currActiveFilter : null;
        }

        function filterWords($words, $activeFilter) {
            $words.each(function () {
                var $wordContainer = $(this);
                var $word = $wordContainer.children().eq(0);
                var activeLetter = getFirstLetter($activeFilter);
                var currLetter = getFirstLetter($word);

                if (activeLetter === currLetter) {
                    $wordContainer.show();
                } else {
                    $wordContainer.hide();
                }
            });
        }
    })();

    //add more files
    (function () {
        var $addFileBase = $('.js-add-file-base');

        if (!$addFileBase.length) {
            return;
        }

        var $template = $($addFileBase[0].outerHTML);
        var $addMoreFileBtn = $('.js-add-more-btn');

        $addMoreFileBtn.on('click', function (e) {
            e.preventDefault();

            $addMoreFileBtn.before($template.clone());
        });
    })();

    //max checked
    (function () {
        var attribute = 'max-checked';
        var $containers = $('[' + attribute + ']');

        $containers.each(function () {
            var $container = $(this);
            var maxChecked = parseInt($container.attr(attribute));

            $container.on('click', 'input[type="checkbox"]', maxCheckedHandler);

            function maxCheckedHandler(e) {
                var $checkboxChecked = $container.find('input[type="checkbox"]:checked');

                if ($checkboxChecked.length <= maxChecked) {
                    return;
                }
                if ($checkboxChecked.length + 1 > maxChecked) {
                    $checkboxChecked.attr('checked', false);
                }

                e.preventDefault();
            }
        });
    })();
});