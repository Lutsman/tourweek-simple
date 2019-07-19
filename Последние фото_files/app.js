$(function () {

    //photo-placer
    (function () {
        if (typeof(SmartGallery) !== 'undefined') {
            const smartgallery = new SmartGallery();
        }
    })();

    /* --- Select2 --- */
    /*$('body').on('initSelect2', '.select2', function(){
        $(this).select2();
        $(this).select2({
            language: {
                noResults: function() {
                    return '" . $this->noResult . "';
                }
            },
            escapeMarkup: function (markup) {
                return markup;
            }
        })
    });
    $('.select2').trigger('initSelect2');*/
    /* --- Select2 --- */

    (function () {
        $('body')
        .on('click', '.js-tm-link', function(){
            var $this = $(this),
                $href = $this.data('href'),
                $target = $this.data('target');

            if ($href) {
                if ($target === '_blank') {
                    window.open($href, '_blank');
                }
                else {
                    window.location.href = $href;
                }
            }
        })
        .on('click', 'a[data-tm-confirm]', function(){//alert('');return false;
            var $this = $(this),
                $method = $this.data('tm-method'),
                $csrfParam = $('meta[name=csrf-param]').attr('content'),
                $csrfToken = $('meta[name=csrf-token]').attr('content'),
                $href = $this.prop('href'),
                $message = $this.data('tm-confirm'),
                $target = $this.data('target');

            var $modal = $('#modal-confirm'),
                modal = UIkit.modal($modal, {'bg-close': false});

            $modal.find('.uk-modal-body').html($message);
            $modal.on('click', 'button[action="yes"]', function(){
                var $form = $('<form action="'+$href+'" method="'+$method+'"></form>');
                if ($csrfParam) {
                    $form.append($('<input/>', {name: $csrfParam, value: $csrfToken, type: 'hidden'}));
                }

                $this.after( $form );
                $form.trigger('submit');
            });
            $modal.on({'hide.uk.modal': function(){ $modal.off('click', 'button[action="yes"]'); }});

            modal.show();

            return false;
        });

    })();
    (function () {
        // Send Form AJAX
        $('.js-form-ajax').on('beforeSubmit', 'form', function(e){
            e.preventDefault();

            var $form = $(this),
                $modalId =  $form.parents('.uk-modal').attr('id'),
                $modal = $modalId ? UIkit.modal($modalId) : null,
                $data = new FormData($form[0]);

            //$data.append('file', v);
            //$data.append('file', v);

            $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $data,//$form.serializeArray(),
                /*dataType: 'JSON',*/
                cache: false,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.success){
                        $form.find('.uk-alert').removeClass('uk-alert-danger uk-hidden').addClass('uk-alert-success').html(response.message);
                        $form.find('input[type="text"], textarea, select').val('');

                        if ($modal) {
                            setTimeout(function () { $modal.hide(); }, 3000);
                        }
                    } else {
                        var msg = '';
                        $.each(response.errors, function (key, errors) {
                            $.each(errors, function (index, error) {
                                msg += error + '<br>';
                            })
                        });
                        $form.find('.uk-alert').removeClass('uk-alert-success uk-hidden').addClass('uk-alert-danger').html(msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert('ERROR 1');
                }
            });

            return false;
        });
    })();

    (function () {
        $('.js-tm-form-password-eye').on('touchstart mousedown', function(e){
            $(this).removeClass('fa-eye').addClass('fa-eye-slash').next('input').prop('type', 'text');
        });
        $('.js-tm-form-password-eye').on('touchend mouseup', function(e){
            $(this).removeClass('fa-eye-slash').addClass('fa-eye').next('input').prop('type', 'password');
        });
        /*
        $('.js-tm-form-password-eye').mousedown(function(e){
            $(this).removeClass('fa-eye').addClass('fa-eye-slash').next('input').prop('type', 'text');
        }).mouseup(function(e){
            $(this).removeClass('fa-eye-slash').addClass('fa-eye').next('input').prop('type', 'password');
        });
        */
    })();

    (function () {
        $('.js-tm-form-birth_date_month, .js-tm-form-birth_date_year').on('change', function(e){
            $('.js-tm-form-birth_date_day').trigger('blur').trigger('change');
        }).on('blur', function(e){
            $('.js-tm-form-birth_date_day').trigger('blur').trigger('change');
        });
    })();

    (function () {
        $('.js-tm-form-country_id, .js-tm-form-region_id')
        .on('change', function(e){//console.log('change');
            $(this).trigger('change-data');
        })
        .on('change-data', function(e){//console.log('change-data');
            var $this = $(this),
                $action = $this.hasClass('js-tm-form-country_id') ? 'get-regions' : 'get-cities',
                $id = $this.val(),
                $selected_value,
                $onChangeId,
                $select_region = $('.js-tm-form-region_id'),
                $select_city = $('.js-tm-form-city_id');

            if ($action === 'get-regions') {//console.log('change-data-regions');
                var select_region = $select_region;//.val('');
                if ($select_region.hasClass('select2')) {
                    select_region = select_region.trigger('initSelect2').next();
                }
                select_region.next('.help-block').html('').parents('.form-group').removeClass('has-success').removeClass('has-error').addClass('uk-hidden').next('hr').addClass('uk-hidden');

                var select_city = $select_city;//.val('');
                if ($select_city.hasClass('select2')) {
                    select_city = select_city.trigger('initSelect2').next();
                }
                select_city.next('.help-block').html('').parents('.form-group').removeClass('has-success').removeClass('has-error').addClass('uk-hidden').next('hr').addClass('uk-hidden');

                if ($select_region.data('init') === 'on') {
                    $selected_value = $select_region.data('selected_value');
                    if ($selected_value) {
                        $onChangeId = 'js-tm-form-region_id';
                    }
                    $select_region.data('init', 'off');
                }
            }
            else {//console.log('change-data-cities');
                var select_city = $select_city;//.val('');
                if ($select_city.hasClass('select2')) {
                    select_city = select_city.trigger('initSelect2').next();
                }
                select_city.next('.help-block').html('').parents('.form-group').removeClass('has-success').removeClass('has-error').addClass('uk-hidden').next('hr').addClass('uk-hidden');

                if ($select_city.data('init') === 'on') {
                    $selected_value = $select_city.data('selected_value');
                    $select_city.data('init', 'off');
                }
            }

            $.ajax({
                type: 'POST',
                url: '/country/get-city-list',
                data: {'action': $action, 'id': $id, 'selected_value': $selected_value},
                success: function (response) {
                    if (response.success) {
                        var $select = $('.js-'+response.select_id);
                        $select.html(response.html).trigger('initSelect2');
                        if ($id) {
                            $select.parents('.form-group').removeClass('uk-hidden').next('hr').removeClass('uk-hidden');//.removeClass('has-success').removeClass('has-error')

                            if ($onChangeId) {
                                $('.'+$onChangeId).trigger('change-data');
                            }
                        }
                    } else {
                        alert('ERROR');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        });
        if ($('.js-tm-form-country_id').data('init') === 'on') {
            $('.js-tm-form-country_id').trigger('change-data');
            $('.js-tm-form-country_id').data('init', 'off');
        }


        $('.js-tm-filter-country_id')
        .on('change', function(e) {//console.log('change-data');
            var $this = $(this),
                $action = $this.data('action'),
                $country_id = $this.val(),
                $select_city = $('.js-tm-filter-city_id'),
                $selected_value = $select_city.data('selected_value');

            if ($action) {
                $.ajax({
                    type: 'POST',
                    url: '/country/'+$action,//get-city-list-with-airport-scoreboard',
                    data: {'country_id': $country_id, 'selected_value': $selected_value},
                    success: function (response) {
                        if (response.success) {
                            $select_city.html(response.html).trigger('initSelect2');
                        } else {
                            alert('ERROR');
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert('ERROR');
                    }
                });
            }
        });

        $('.js-tm-filter-form-city').on('submit', function(e){
            var $this = $(this),
                $action = $this.prop('action'),
                $country = $this.find('[name="country"]'),
                //$city = $this.find('[name="city_id"]'),
                //$category = $this.data('category'),
                $arr = [$action, $country.val(), 'regions'];

            var arr = [];
            for(var i in $arr) {
                if ($arr[i]) {
                    arr.push($arr[i]);
                }
            }

            $country.prop('disabled', true);

            $this.prop('action', arr.join('/'));
        });


        $('.js-country-view_map-button').on('click', function(e){
            if ($('.js-country-view_map-container').is(':empty')) {
                mapCreate();
            }
            UIkit.modal('#modal-country-view_map').show();
        });

        $('.js-city-view_map-button').on('click', function(e){
            if ($('.js-city-view_map-container').is(':empty')) {
                mapCreate();
            }
            UIkit.modal('#modal-city-view_map').show();
        });
    })();

    (function () {
        $('.js-tm-filter-form-sight').on('submit', function(e){
            var $this = $(this),
                $action = $this.prop('action'),
                $country = $this.find('[name="country_id"]'),
                $city = $this.find('[name="city_id"]'),
                $category = $this.data('category'),
                $arr = [$action, $country.val(), $city.val(), $category];

            var arr = [];
            for(var i in $arr) {
                if ($arr[i]) {
                    arr.push($arr[i]);
                }
            }

            $country.prop('disabled', true);
            $city.prop('disabled', true);

            $this.prop('action', arr.join('/'));
        });

        $('.js-sight-view_map-button').on('click', function(e){
            if ($('.js-sight-view_map-container').is(':empty')) {
                mapCreate();
            }
            UIkit.modal('#modal-sight-view_map').show();
        });
    })();

    (function () {
        $('body').on('submit', 'form[data-tm-form-clear]', function(e){
            var form = $(this),
                besides = [];

            if ( form.data('tm-form-clear-besides') ){
                besides = form.data('tm-form-clear-besides').split(',');
            }

            preSubmitForm($(this).get()[0], besides);
        })
    })();

    (function () {
        $('.js-article-list-countries_button').on('click', function(e){
            var $category_id = $(this).data('category_id');

            $.ajax({
                type: 'POST',
                url: '/country/get-country-list-with-article-count',
                data: {'category_id': $category_id},
                success: function (response) {
                    if (response.success) {
                        $('.js-article-list-countries_container').html(response.html);
                        UIkit.modal('#modal-article-list-countries').show();
                    } else {
                        alert('ERROR');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        });
    })();

    (function () {
        $('.js-tm-blogs_tab').on('click', 'li > a', function(e){
            var $this = $(this),
                $tabs = $('.js-tm-blogs_tab'),
                $rel = $this.data('tm-blogs_tab'),
                $container = $('.js-tm-blogs_tab-container'),
                $containerTab = $container.find('[data-tm-blogs_tab-container="'+$rel+'"]'),
                changeTab = function($this_) {
                    $tabs.find('> li').removeClass('uk-active');
                    $this_.parent('li').addClass('uk-active');
                },
                changeContainerTab = function($this_) {
                    $container.find('> div').addClass('uk-hidden');
                    $this_.removeClass('uk-hidden');
                };

            if ($rel) {
                changeTab($this);
                if ($containerTab.length) {
                    changeContainerTab($containerTab);
                }
                else {
                    $containerTab = $('<div class="uk-hidden" data-tm-blogs_tab-container="'+$rel+'"></div>');
                    $container.append($containerTab);

                    var $action = ($rel === 'countries') ? '/country/get-country-list-with-blog-count' : '/blog/get-category-list-with-blog-count';

                    $.ajax({
                        type: 'POST',
                        url: $action,
                        data: {},
                        success: function (response) {
                            if (response.success) {
                                $containerTab.html(response.html);
                                changeContainerTab($containerTab);
                            } else {
                                alert('ERROR');
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert('ERROR');
                        }
                    });
                }

                e.preventDefault();
            }
        });
        if (typeof tmBlogsTabActive !== typeof undefined && tmBlogsTabActive) {
            $('.js-tm-blogs_tab [data-tm-blogs_tab="'+tmBlogsTabActive+'"]').trigger('click');
        }


        $('.js-tm-form-blogs_type select').on('change', function(e){
            var $this = $(this),
                $text = $('.js-tm-form-blogs_text'),
                $photo = $('.js-tm-form-blogs_photo'),
                $video = $('.js-tm-form-blogs_video');

            if ($this.val() === '1') {
                $text.removeClass('uk-hidden');
                $photo.addClass('uk-hidden');
                $video.addClass('uk-hidden');
            } else if ($this.val() === '2') {
                $text.addClass('uk-hidden');
                $photo.removeClass('uk-hidden');
                $video.addClass('uk-hidden');
            } else if ($this.val() === '3') {
                $text.addClass('uk-hidden');
                $photo.addClass('uk-hidden');
                $video.removeClass('uk-hidden');
            }
        }).trigger('change');
    })();

    (function () {
        $('.js-input-video_youtube').on('blur', 'input', function(e){
            e.preventDefault();

            var $this = $(this),
                $parent = $this.parent(),
                $url = $this.val(),
                $m = $url.match(/(?:https?:)?\/\/(?:www\.youtube\.com\/embed\/|youtu.be\/|www\.youtube\.com\/watch\?v=)([a-z0-9\-]+)/i),
                $iframe = $parent.next('.form-group').children('iframe'),
                iframeSrc = function(key) {
                    return 'https://www.youtube.com/embed/' + key;
                },
                iframeHtml = function(key) {
                    return '<div class="form-group"><iframe style="width: 100%; height: 360px" src="'+iframeSrc(key)+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
                };//console.log($m);

            if ($m && $m[1]) {
                if ($iframe.length) {
                    $iframe.attr('src', iframeSrc($m[1]));
                }
                else {
                    $parent.after(iframeHtml($m[1]));
                }
            }
            else {
                $iframe.remove();
            }
        })
        .children('input').trigger('blur');
    })();

    (function () {
        $('.js-visa-list-countries_button').on('click', function(e){
            $.ajax({
                type: 'POST',
                url: '/country/get-country-list-with-visa',
                data: {},
                success: function (response) {
                    if (response.success) {
                        $('.js-visa-list-countries_container').html(response.html);
                        UIkit.modal('#modal-visa-list-countries').show();
                    } else {
                        alert('ERROR');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        });

        $('.js-form-visa').on('submit', function(e){
            var $this = $(this),
                $slug = $this.find('select').val();

            if ($slug) {
                $this.prop('action', '/'+$this.data('slug')+'/'+$slug);
            }
            else {
                e.preventDefault();
            }
        });
    })();

    (function () {
        $('.js-airline-list-countries_button').on('click', function(e){
            $.ajax({
                type: 'POST',
                url: '/country/get-country-list-with-airline',
                data: {},
                success: function (response) {
                    if (response.success) {
                        $('.js-airline-list-countries_container').html(response.html);
                        UIkit.modal('#modal-airline-list-countries').show();
                    } else {
                        alert('ERROR');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        });
    })();

    (function () {
        $('.js-tm-companions_tab').on('click', function(e){
            var $this = $(this),
                $tabs = $('.js-tm-companions_tab'),
                $rel = $this.data('tm-companions_tab'),
                $container = $('.js-tm-companions_tab-container'),
                $containerTab = $container.find('[data-tm-companions_tab-container="'+$rel+'"]'),
                changeTab = function($this_) {
                    $tabs.removeClass('uk-button-orange').addClass('uk-button-simple-orange');
                    $this_.removeClass('uk-button-simple-orange').addClass('uk-button-orange');
                },
                changeContainerTab = function($this_) {
                    $container.find('> div').addClass('uk-hidden');
                    $this_.removeClass('uk-hidden');
                };

            if ($rel) {
                $container.find('> ul').remove();

                changeTab($this);
                if ($containerTab.length) {
                    changeContainerTab($containerTab);
                }
                else {
                    $containerTab = $('<div class="uk-hidden" data-tm-companions_tab-container="'+$rel+'"></div>');
                    $container.append($containerTab);

                    var $action = ($rel === 'countries') ? '/country/get-country-list-with-companion-count' : (($rel === 'cities') ? '/country/get-city-list-with-companion-count' : '/companion/get-purpose-trip-list-with-companion-count');

                    $.ajax({
                        type: 'POST',
                        url: $action,
                        data: {},
                        success: function (response) {
                            if (response.success) {
                                $containerTab.html(response.html);
                                changeContainerTab($containerTab);
                            } else {
                                alert('ERROR');
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert('ERROR');
                        }
                    });
                }

                e.preventDefault();
            }
        });
        /*if (typeof tmCompanionsTabActive !== typeof undefined && tmCompanionsTabActive) {
            $('.js-tm-companions_tab[data-tm-companions_tab="'+tmCompanionsTabActive+'"]').trigger('click');
        }*/
    })();

    (function () {
        $('.js-form-companion').on('submit', function(e){
            var $this = $(this),
                $country = $this.find('select[name="country"]'),
                $slug = $country.val();

            if ($slug) {
                $this.prop('action', '/'+$this.data('slug')+'/country/'+$slug);
                $country.prop('disabled', true);
            }
            else {
                $this.prop('action', '/'+$this.data('slug'));
                //e.preventDefault();
            }
        });

        $('.js-data-companions_period_no').on('change', function(e){
            var $this = $(this).find('input'),
                $period_start = $('.js-data-companions_period_start').find('input'),
                $period_end = $('.js-data-companions_period_end').find('input');

            if ($this.is(':checked')) {
                $period_start.prop('disabled', true).val('');
                $period_end.prop('disabled', true).val('');
            }
            else {
                $period_start.prop('disabled', false);
                $period_end.prop('disabled', false);
            }
        }).trigger('change');

        $('.js-data-companions_text').on('input', 'textarea', function(e){
            e.preventDefault();

            var $this = $(this),
                $count = 2000 - $this.val().length;

            $('.js-data-companions_text-count').text($count);

        }).find('textarea').trigger('input');

        $('.tm-vote-interactive')
        .on('init', function(e){
            var $this = $(this);

            $this.find('input:checked').parent().trigger('click');
        })
        .on('mouseover', '.fa', function(e){
            var $this = $(this),
                $parent = $this.parents('.tm-vote-interactive'),
                $index = $this.index() + 1;//console.log($index);

            $parent.removeClass('tm-vote_1 tm-vote_2 tm-vote_3 tm-vote_4 tm-vote_5');
            if ($index) {
                $parent.addClass('tm-vote_'+$index);
            }
        })
        .on('mouseout', '.fa', function(e){
            var $this = $(this),
                $parent = $this.parents('.tm-vote-interactive'),
                $index = $parent.data('index');//console.log($index);

            $parent.removeClass('tm-vote_1 tm-vote_2 tm-vote_3 tm-vote_4 tm-vote_5');
            if ($index) {
                $parent.addClass('tm-vote_' + $index);
            }
        })
        .on('click', '.fa', function(e){
            var $this = $(this),
                $parent = $this.parents('.tm-vote-interactive'),
                $index = $this.index() + 1;//console.log($index);

            $parent.data('index', $index);
            $parent.removeClass('tm-vote_1 tm-vote_2 tm-vote_3 tm-vote_4 tm-vote_5');
            if ($index) {
                $parent.addClass('tm-vote_' + $index);
            }
        })
        .trigger('init');

        $('.js-tm-vote-interactive-ajax').on('change', 'input:checked', function(e){
            var $this = $(this),
                $parent = $this.parents('.tm-vote-interactive');

            $.ajax({
                type: 'POST',
                url: '/rating/set-rating',
                data: {tbl: $parent.data('tbl'), tbl_id: $parent.data('tbl_id'), rate: $this.val()},
                success: function (response) {
                    if (response.success) {
                        $('.js-tm-vote-interactive-ajax_rating').text(response.rating['rating']);
                        $('.js-tm-vote-interactive-ajax_count').text(response.rating['count']);
                    } else {
                        $.each(response.errors, function (key, errors) {
                            $.each(errors, function (index, error) {
                                alert(error);
                            });
                        });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        });
    })();

    (function () {
        $('.js-form-question').on('submit', function(e){
            var $this = $(this),
                $country = $this.find('select[name="country"]'),
                $category = $this.find('select[name="category"]'),
                $paths = [],
                $slug = $this.data('slug');

            $paths.push($slug);
            if ($country.val()) {
                $paths.push('country/' + $country.val());
            }
            if ($category.val()) {
                $paths.push($category.val());
            }

            if ($slug) {
                $this.prop('action', '/'+$paths.join('/'));
                $country.prop('disabled', true);
                $category.prop('disabled', true);
            }
            else {
                //e.preventDefault();
            }
        });

        $('.js-questions-list-item')
        .on('submit', '> form', function(e){
            e.preventDefault();

            /*var $this = $(this),
                $count = $this.parents('.js-questions-list-item').find('.js-questions-list-item_count'),
                $item = $this.parents('.js-questions-list-item').find('.js-answers-list');*/

            var $this = $(this),
                $itemQuestion = $this.parents('.js-questions-list-item'),
                $count = $itemQuestion.find('.js-questions-list-item_count'),
                $controlQuestion = $itemQuestion.find('.js-questions-list-item_control'),
                $item = $this.parents('.js-questions-list-item').find('.js-answers-list');

            if (!$.trim($this.find('textarea').val())) {
                return false;
            }

            $.ajax({
                type: 'POST',
                url: '/faq/answer-create',
                data: $this.serializeArray(),//{category_id: $this.data('category_id')},
                success: function (response) {
                    if (response.success) {
                        if ($item.children('ul').length) {
                            $item.children('ul').append(response.html)
                        }
                        else {
                            $item.html('<ul>' + response.html + '</ul>');
                        }
                        $this.find('textarea').val('');
                        $this.attr('hidden', '');

                        $count.find('a span').text(response.count);
                        $controlQuestion.html('');
                        $item.parent().removeAttr('hidden');
                    } else if (response.success === false) {

                    } else {
                        alert('ERROR');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        })
        .on('submit', '.js-answers-list-item form', function(e){
            e.preventDefault();

            /*var $this = $(this),
                $count = $this.parents('.js-questions-list-item').find('.js-questions-list-item_count'),
                $item = $this.parents('.js-answers-list-item');*/

            var $this = $(this),
                $itemQuestion = $this.parents('.js-questions-list-item'),
                $count = $itemQuestion.find('.js-questions-list-item_count'),
                $controlQuestion = $itemQuestion.find('.js-questions-list-item_control'),
                $itemAnswer = $this.parents('.js-answers-list-item'),
                $controlAnswer = $itemAnswer.find('.js-answers-list-item_control');

            if (!$.trim($this.find('textarea').val())) {
                return false;
            }

            $.ajax({
                type: 'POST',
                url: '/faq/answer-create',
                data: $this.serializeArray(),//{category_id: $this.data('category_id')},
                success: function (response) {
                    if (response.success) {
                        if ($itemAnswer.next('ul').length) {
                            $itemAnswer.next('ul').append(response.html)
                        }
                        else {
                            $itemAnswer.after('<ul>' + response.html + '</ul>');
                        }
                        $this.find('textarea').val('');
                        $this.attr('hidden', '');

                        $count.find('a span').text(response.count);
                        $controlQuestion.html('');
                        $controlAnswer.html('');
                    } else if (response.success === false) {

                    } else {
                        alert('ERROR');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        })
        .on('click', '.js-answers-list-item .js-answers-list-item_update', function(e){
            e.preventDefault();

            var $this = $(this),
                $buttonComplete = $this.parent().parent().find('.js-answers-list-item_update-complete'),
                $itemAnswer = $this.parents('.js-answers-list-item'),
                $answer_id = $this.data('answer_id'),
                $text = $itemAnswer.find('[contenteditable]');

            if (!$answer_id) {
                return false;
            }

            if ($text.data('has-changed')) {
                $text.next('textarea').val($text.html().replace(/<br\s*\/?>/mg, "\n"));
            }
            else {
                $text.data('has-changed', true);
            }
            $text.addClass('uk-hidden');
            $text.next('textarea').removeClass('uk-hidden');
            //console.log($text.html().replace(/<br\s*\/?>/mg, "\n"));

            $this.parent().addClass('uk-hidden');
            $buttonComplete.parent().removeClass('uk-hidden');
        })
        .on('click', '.js-answers-list-item .js-answers-list-item_update-complete', function(e){
            e.preventDefault();

            var $this = $(this),
                $buttonUpdate = $this.parent().parent().find('.js-answers-list-item_update'),
                $itemAnswer = $this.parents('.js-answers-list-item'),
                $date = $itemAnswer.find('.js-answers-list-item_date'),
                $answer_id = $this.data('answer_id'),
                $text = $itemAnswer.find('[contenteditable]');

            if (!$answer_id || !$text.next('textarea').val()) {
                return false;
            }

            $text.html($text.next('textarea').val().replace(/\n/g, "<br>")).removeClass('uk-hidden');
            $text.next('textarea').addClass('uk-hidden');
            //console.log($text.next('textarea').val().replace(/\n/g, "<br>"));

            $this.parent().addClass('uk-hidden');
            $buttonUpdate.parent().removeClass('uk-hidden');

            $.ajax({
                type: 'POST',
                url: '/faq/answer-update',
                data: {answer_id: $answer_id, text: $text.next('textarea').val()},
                success: function (response) {
                    if (response.success) {
                        $date.text(response.updated_at);
                    } else if (response.success === false) {

                    } else {
                        alert('ERROR');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        })
        .on('click', '.js-answers-list-item .js-answers-list-item_delete', function(e){
            e.preventDefault();

            /*if (!confirm('Вы уверены, что хотите удалить этот элемент?')) {
                return false;
            }*/

            var $this = $(this),
                $modal = $('#modal-confirm'),
                modal = UIkit.modal($modal, {'bg-close': false});

            $modal.find('.uk-modal-body').html('Вы уверены, что хотите удалить этот элемент?');
            $modal.on('click', 'button[action="yes"]', function(){
                var $itemQuestion = $this.parents('.js-questions-list-item'),
                    $count = $itemQuestion.find('.js-questions-list-item_count'),
                    $controlQuestion = $itemQuestion.find('.js-questions-list-item_control'),
                    $itemAnswer = $this.parents('.js-answers-list-item'),
                    $itemParent = $itemAnswer.parent('li').parent('ul').prev('.js-answers-list-item'),
                    $controlParent = $itemParent.find('.js-answers-list-item_control'),
                    $answer_id = $this.data('answer_id');

                if (!$answer_id) {
                    return false;
                }

                $.ajax({
                    type: 'POST',
                    url: '/faq/answer-delete',
                    data: {answer_id: $answer_id},
                    success: function (response) {
                        if (response.success) {
                            $itemAnswer.remove();

                            $count.find('a span').text(response.count);
                            $controlQuestion.html(response.controlQuestion);
                            $controlParent.html(response.controlParent);
                        } else if (response.success === false) {

                        } else {
                            alert('ERROR');
                        }

                        modal.hide();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert('ERROR');

                        modal.hide();
                    }
                });
            });
            $modal.on({'hide.uk.modal': function(){ $modal.off('click', 'button[action="yes"]'); }});

            modal.show();
        });

        $('.js-question-list-countries_button').on('click', function(e){
            var $this = $(this);

            $.ajax({
                type: 'POST',
                url: '/country/get-country-list-with-faq-question',
                data: {category_id: $this.data('category_id')},
                success: function (response) {
                    if (response.success) {
                        $('.js-question-list-countries_container').html(response.html);
                        UIkit.modal('#modal-question-list-countries').show();
                    } else {
                        alert('ERROR');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('ERROR');
                }
            });
        });

        $('.js-modal-site-login_button').on('click', function(e){
            e.preventDefault();

            var $this = $(this),
                $modal = UIkit.modal('#modal-site-login', {}),
                $form = $('.js-form-site-login').find('form');

            $form.data('redirect', $this.attr('href'));
            $modal.show();
        });

        // Send Login Form AJAX
        $('.js-form-site-login').on('beforeSubmit', 'form', function(e){//console.log(window.location.href);return false;
            e.preventDefault();

            var $form = $(this),
                //$modalId =  $form.parents('.uk-modal').attr('id'),
                //$modal = $modalId ? UIkit.modal($modalId) : null,
                $data = new FormData($form[0]);//$form.serializeArray();

            $data.append('redirect', $form.data('redirect'));
            //$data.append('file', v);
            //$data.append('file', v);

            $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $data,
                /*dataType: 'JSON',*/
                cache: false,
                processData: false,
                contentType: false,
                success: function (response) {//console.log(response);
                    var $groups = $form.find('.form-group');

                    $groups.removeClass('has-error').removeClass('has-success');
                    $groups.find('.help-block').html('');

                    if (response.success){
                        window.location.replace(response.redirect);
                        //window.location.href = response.redirect;
                        window.location.reload();
                    } else {
                        $.each(response.errors, function (key, errors) {
                            var $item = $form.find('.field-loginform-'+key);

                            $item.addClass('has-error');
                            $.each(errors, function (index, error) {
                                $item.find('.help-block').html(error);
                            });
                        });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert('ERROR 1');
                }
            });

            return false;
        });

        if ($('.js-questions-list-item').length) {//console.log(window.location.href);
            var $url = window.location.href,
                $index = $url.indexOf("#"),
                $id = ($index !== -1) ? $url.substring($index + 1) : "";

            if ($id) {
                //if ($id.indexOf("-inside-") !== -1) {
                if ($id.indexOf("answer-") === 0) {
                    var $parent_id = $('#'+$id).parents('[id^="question-"]')/*('[id^="tm-answers-list-"]')*/.attr('id');

                    UIkit.toggle($('#'+$id).prev().find('.js-modal-site-login_button, a[uk-toggle]'), {target: '#'+$id}).toggle();
                    if ($('.js-questions-list').length) {
                        UIkit.toggle($('#'+$parent_id).prev().find('.js-questions-list-item_count > a[uk-toggle]'), {target: '#'+$parent_id}).toggle();
                    }

                    //UIkit.scroll('#'+$id);
                }
                else if ($id.indexOf("question-") === 0) {
                    UIkit.toggle($('#'+$id).prev().prev().prev().find('.js-modal-site-login_button, a[uk-toggle]'), {target: '#'+$id}).toggle();
                }
            }
        }
    })();

    (function(){
        $('.js-filter-form-user_details').on('change', 'input', function(e){
            e.preventDefault();

            if ($(this).is(':checked')) {
                $('#tm-filter-form-user_details').removeClass('uk-hidden');
            }
            else {
                $('#tm-filter-form-user_details').addClass('uk-hidden');
            }
        });
    })();

    $('a[js-tm-toggle]').on('click', function(e){
        e.preventDefault();

        var $this = $(this),
            $href = $this.attr('href');

        if ($($href).length) {
            window.location.replace($href);

            if ($this.data('init-toggle') !== true) {
                $this.data('init-toggle', true);
                UIkit.toggle($this).toggle();
            }
        }
        else {
            return false;
        }
    });

    /*$('.js-form-contenteditable')
    .on('beforeSubmit', function(e){
        e.preventDefault();

        var $this = $(this),
            $editable = $this.find('.ck-editor__editable[contenteditable]');


        $editable.next('textarea').html($editable.html());
    });*/
    /*$('div[contenteditable]').keydown(function(e) {
        // trap the return key being pressed
        if (e.keyCode === 13) {
            // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
            document.execCommand('insertHTML', false, '\n');
            // prevent the default behaviour of return key pressed
            return false;
        }
    });*/

    function nl2br (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
    }




    // datepicker
    (function () {
        var $datepicker = $('[datepicker]'),
            $options = {
                placeholder: '',
                lang: 'ru-RU',
                format: 'dd.MM.yyyy',
            };

        $datepicker.each(function(e){
            var val = $(this).val(),
                options = Object.assign({}, $options);

            if (val) {
                options['defaultValue'] = val;
            }

            $(this).datepicker(options);
        });
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
                $overlay.fadeOut(200, function() {
                    $overlay.remove();
                    $body.removeClass(relativePosClassName);
                });
            },
        });
    })();

    // scroller
    /*(function () {
        new ScrollToAnchor({
            listenedBlock: '.js-search-start',
        });
    })();*/

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

    //tourist dictionary
    /*(function () {
        var $filterContainer = $('.tm-dictionary-links');
        var $words = $filterContainer.nextAll();
        var activeClass = 'tm-active';
        var $activeFilter = getDefaultFilter($filterContainer, activeClass);

        filterWords($words, $activeFilter);
        $filterContainer.on('click', 'a', clickHandler);

        function clickHandler(e) {
            e.preventDefault();
            var $filter = $(this);

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
    })();*/

    //add more files
    /*(function () {
        var $addFileBase = $('.js-add-file-base');

        if (!$addFileBase.length) return;

        var $template = $($addFileBase[0].outerHTML);
        var $addMoreFileBtn = $('.js-add-more-btn');

        $addMoreFileBtn.on('click', function (e) {
            e.preventDefault();

            $addMoreFileBtn.before($template.clone());
        });
    })();*/

    //max checked
    /*(function () {
        var attribute = 'max-checked';
        var $containers = $('[' + attribute + ']');

        $containers.each(function () {
            var $container = $(this);
            var maxChecked = parseInt($container.attr(attribute));

            $container.on('click', 'input[type="checkbox"]', function (e) {
                var $checkboxChecked = $container.find('input[type="checkbox"]:checked');

                if ($checkboxChecked.length <= maxChecked) {
                    return;
                }
                if ($checkboxChecked.length + 1 > maxChecked) {
                    $checkboxChecked.attr('checked', false);
                }

                e.preventDefault();
            });
        });
    })();*/

    if($('#map').length && !$('#map').parents('.uk-modal').length) {
        mapCreate();
    }
});


function mapCreate() {
    ymaps.ready(function () {
        if($('#map').length)
        {
            var map = new ymaps.Map ("map", {
                center: mapCenter,
                zoom: mapZoom,
                controls: []
            });

            map.behaviors.disable('scrollZoom');
            map.controls.add(
                new ymaps.control.ZoomControl()
            );

            var mapDraw = function(coordinates) {
                if (coordinates.length)
                {
                    var icon = {};
                    if (typeof mapIcon !== typeof undefined){
                        icon = {
                            iconLayout: 'default#image',
                            iconImageHref: mapIcon,
                            iconImageSize: mapIconSize,
                            iconImageOffset: mapIconOffset
                        };
                    }

                    var myPlacemark = new ymaps.Placemark(coordinates, typeof mapTitle !== typeof undefined ? { balloonContentHeader: mapTitle } : {}, icon);

                    map.geoObjects.add(myPlacemark);
                    map.setCenter(coordinates);

                    if( typeof mapPolygon !== typeof undefined) {
                        var polygon = new ymaps.Polygon(mapPolygon || [], {}, {
                            fillColor: '#FF0000',
                            strokeColor: '#0000FF',
                            opacity: 0.4,
                            strokeWidth: 3,
                            strokeStyle: 'shortdash'
                        });
                        map.geoObjects.add(polygon);
                        map.setBounds(polygon.geometry.getBounds(), {margin: 70});
                    }
                }
            };

            if (typeof mapCoordinates !== typeof undefined && mapCoordinates.length)
            {
                for (var i in mapCoordinates) {
                    mapDraw(mapCoordinates[i]);
                }
            }
            if (typeof mapAddresses !== typeof undefined && mapAddresses.length)
            {
                for (var i in mapAddresses) {
                    ymaps.geocode(mapAddresses[i]).then(function(result) {
                        var cordinates = result.geoObjects.get(0).geometry.getCoordinates();
                        mapDraw(cordinates);
                    });
                }
            }
        }
    });
}

function preSubmitForm(form, besides)
{
    if (typeof besides === typeof undefined){
        besides = [];
    }

    for(var i = 0; i < form.elements.length; i++) {
        var e = $(form.elements[i]);
        if( (e.val() === '' || e.val() === '0') && besides.indexOf(e.attr('name')) === -1 ) {
            e.attr('disabled', 'true');
        }
    }
}