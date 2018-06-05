/**
 * Description of forms.
 *
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 05.12.17 8:39
 */

/**
 * Global variables
 */
"use strict";

$(document).ready(function () {
    /**
     * Global functions for scripts.
     * @type {clearFormAfterRequest}
     */
    App = _.extend(App, {
       common: {
           clearForm: clearFormAfterRequest,
           closeModalForm: closeModalForm
       }
    });

	var isNoviBuilder = window.xMode,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		plugins = {
			captcha   : $('.recaptcha'),
			rdMailForm: $('.rd-mailform')
		};

	// Set the forms IDs for their search to reset
    plugins.rdMailForm.map(function (index, item) {
        item.counter = index;
    });

	function csrfSafeMethod(method) {
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}

	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
			}
		}
	});

	/**
	 * onloadCaptchaCallback
	 * @description  init google reCaptcha
	 */
	onloadCaptchaCallback = function () {

		for (i = 0; i < plugins.captcha.length; i++) {
			var $capthcaItem = $(plugins.captcha[i]),
				key;

			key = (window.reCaptchaSiteKey) ? reCaptchaSiteKey : $capthcaItem.attr('data-sitekey');

			plugins.captcha[i].reCaptchaWidgetId = grecaptcha.render(
				$capthcaItem.attr('id'),
				{
					sitekey : key,
					size    : $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
					theme   : $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
					callback: function (e) {
						$('.recaptcha').trigger('propertychange');
					}
				}
			);
			$capthcaItem.after("<span class='form-validation'></span>");
		}
	};

	if (plugins.captcha.length) {
		var lang = $('html').attr('lang');
		$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl="+lang);
	}

	/**
	 * isValidated
	 * @description  check if all elemnts pass validation
	 */
	function isValidated(elements, captcha) {
		var results, errors = 0;

		if (elements.length) {
			for (j = 0; j < elements.length; j++) {

				var $input = $(elements[j]);
				if ((results = $input.regula('validate')).length) {
					for (k = 0; k < results.length; k++) {
						errors++;
						$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
					}
				} else {
					$input.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}

			if (captcha) {
				if (captcha.length) {
					return validateReCaptcha(captcha) && errors == 0
				}
			}

			return errors == 0;
		}
		return true;
	}

	/**
	 * validateReCaptcha
	 * @description  validate google reCaptcha
	 */
	function validateReCaptcha(captcha) {
		var $captchaToken = captcha.find('.g-recaptcha-response').val();

		if ($captchaToken == '') {
			captcha
				.siblings('.form-validation')
				.html(gettext('Please, confirm, that you are not a robot.'))
				.addClass('active');
			captcha
				.closest('.form-group')
				.addClass('has-error');

			captcha.bind('propertychange', function () {
				var $this = $(this),
					$captchaToken = $this.find('.g-recaptcha-response').val();

				if ($captchaToken != '') {
					$this
						.closest('.form-group')
						.removeClass('has-error');
					$this
						.siblings('.form-validation')
						.removeClass('active')
						.html('');
					$this.unbind('propertychange');
				}
			});

			return false;
		}

		return true;
	}

	/**
	 * Clear the form after the arrival of the server response result.
	 */
	function clearFormAfterRequest(scope, options) {
		var index = scope.extraData ? scope.extraData.counter : scope.counter,
            form = $(plugins.rdMailForm[index]),
			captcha = plugins.captcha[index],
			select = form.find('select');

		form.clearForm();

		try {
			if (options.hasCaptcha) {
				grecaptcha.reset(captcha.reCaptchaWidgetId);
			}
		}
		catch (e) {
			console.log(e);
		}

		if (select.length) {
			select.select2("val", "");
		}

		form.find('input, textarea').trigger('blur');
		form.find('.form-validation').html('');

		var files = form.find('input[type=file]');
		if (files.length > 0) {
			files.val('');
		}

		var removeClass = options ? options.removeClass : undefined;
		if (removeClass) {
			form.removeClass(removeClass)
		}

		var addClass = options ? options.addClass : undefined;
		if (addClass) {
			form.addClass(addClass)
		}
	}

	function closeModalForm(form) {
        var modalId = form.attr('data-modal-id');
		if (modalId) {
			$('#' + modalId).modal('hide');
		}
    }

	if (plugins.rdMailForm.length) {
		var i, j, k;

		for (i = 0; i < plugins.rdMailForm.length; i++) {
			var $form = $(plugins.rdMailForm[i]),
				formHasCaptcha = false;

			$form.attr('novalidate', 'novalidate').ajaxForm({
				data        : {
					"form-type": $form.attr("data-form-type") || "contact",
					"counter"  : i
				},
				beforeSubmit: function (arr, $form, options) {
					if (isNoviBuilder)
						return;

					var form = $(plugins.rdMailForm[this.extraData.counter]),
						inputs = form.find("[data-constraints]"),
						captcha = form.find('.recaptcha');

					if (isValidated(inputs, captcha)) {
						form.addClass('form-in-process');
						formHasCaptcha = captcha.length > 0;
					} else {
						return false;
					}
				},
				success     : function (result) {
					if (isNoviBuilder)
						return;

                    var form = plugins.rdMailForm[this.extraData.counter];

					clearFormAfterRequest(form, {
						removeClass: 'form-in-process',
						addClass   : 'success',
                        hasCaptcha :  formHasCaptcha
					});

                    closeModalForm($form);

					showMessage(result);
				},
				error       : function (result) {
					if (isNoviBuilder)
						return;

                    var form = plugins.rdMailForm[this.extraData.counter];

					clearFormAfterRequest(form, {
						removeClass: 'form-in-process',
                        hasCaptcha :  formHasCaptcha
					});

                    closeModalForm($form);

					showMessage(result);
				}
			});
		}
	}

	function showMessage(response) {
		var modalPr = $('#message-modal-text'),
			data,
            errorsList = [],
            errorMsg = gettext('Unknown error!');

		try {
    		data = _.isString(response) ? JSON.parse(response) : response;
            /**
             * If answer in fail, error
             */
            if (data.responseJSON) {
                data = data.responseJSON;
            }
        }
        catch (e) {
            data = {
                success: false,
                errorText: gettext('Unknown error!')
            }
        }

        if (!data.success) {
            for (var key in data.errorText) {
                if (_.isArray(data.errorText[key])) {
                    errorsList = _.concat(errorsList, data.errorText[key]);
                }
            }

            if (errorsList.length > 0) {
                errorMsg = _.join(errorsList, '<br/>');
            }

            modalPr[0].innerHTML = errorMsg;
        } else {
            modalPr[0].innerHTML = data.messageText;
        }

		// modalPr[0].innerHTML = data.success ? data.messageText : data.errorText;
		$('#message-modal').modal('show');
	}

	// Load cities in selecting country
	(function () {
		var countryCombo = $('#country'),
			cityCombo = $('#cities'),
			defaultOption,
			url = cityCombo.attr('data-load-url') || '/cities';

		defaultOption = new Option(gettext('All cities'), '', true, true);

		countryCombo.on('select2:select', function (e) {
			var country = countryCombo.val();

			cityCombo.empty();
			cityCombo.append(defaultOption);

			if (country != '') {
				$.ajax({
					type: 'GET',
					url : url,
					data: {
						country: country
					}
				})
					.done(function (data) {
						if (data.success) {
							for (var i = 0; i < data.results.length; i++) {
								var option = new Option(data.results[i].name, data.results[i].slug, false, false);
								cityCombo.append(option);
							}
							cityCombo.trigger('change');
						}
						else {
							showMessage(data);
						}

					})
					.fail(function (data) {
						showMessage(data);
					});
			} else {
				cityCombo.trigger('change');
			}
		});

	})();

	/**
	 * Vacancy object.
	 * @param options
	 * @constructor
	 */
	function Vacancy(options) {
		var me = this;

		me.isRendered = false;

		me.template = _.template(
			'<td>' +
				'<a class="person-position" href="<%= url %>"><%= name %></a>' +
			'</td>' +
			'<td>' +
			'   <p><%= profile %></p>' +
			'</td>' +
			'<td>' +
			'   <p><%= country + \', \' + text_count_cities %></p>' +
			'</td>' +
			'<td class="text-right send-profile-cell">' +
				'<a class="button button-sm button-primary" href="<%= url + \'#send-profile\' %>">' + gettext('Respond') + '</a>' +
			'</td>'
		);

		me.mobiTemplate = _.template(
			'<div class="box-info">' +
				'<div class="box-info-inner">' +
					'<h6 class="box-info-title"><a href="<%= url %>"><%= name %></a></h6>' +
					'<p><%= profile %></p>' +
				'</div>' +
				'<div class="box-info-footer">' +
					'<ul>' +
						'<li class="box-classic">' +
							'<span class="icon icon-primary-gradient mdi mdi-map-marker icon-point"></span>' +
							'<span class="icon-point-title"><%= country + \', \' + text_count_cities %></span>' +
						'</li>' +
						'<li class="box-classic text-center">' +
							'<a href="<%= url + \'#send-profile\' %>" ' +
							'class="scroll button button-sm button-primary with-lato">' + gettext('Respond') + '</a>' +
						'</li>' +
					'</ul>' +
				'</div>' +
			'</div>'
		);

		_.assign(me, options);
	}

	Vacancy.prototype.render = function () {
		var me = this,
			config = {},
			result;

		_.assign(config, me);

		result = {
			full: me.template(config),
			mobi: me.mobiTemplate(config),
			isRender: true
		};

		me.isRendered = true;

		return result;
	};

	/**
	 * Vacancy list object.
	 * @constructor
	 */
	function VacanciesList(options) {
		var me = this;
		_.assign(me, options);
        me.saveLoadUrl = options.loadUrl;
		me.hireTable = $('#' + me.hireTableId);
		me.mobiHireTable = $('#' + me.mobiHireTableId);

		me.emptyTemplate = _.template(
			'<div id="no-vacancies" class="text-center">'+
				'<p class="smyt-big"><%= message %></pcl>'+
			'</div>'
		);

		me.list = [];
		me.init();
	}

	VacanciesList.prototype.init = function () {
		var me = this;
        if (me.afterInit && _.isFunction(me.afterInit)) {
            me.afterInit();
        }
	};

	VacanciesList.prototype.render = function () {
		var me = this,
			row = _.template('<tr><%= content %></tr>'),
			body = me.hireTable.find('tbody'),
			tr,
			itemContent;

		me.list.forEach(function (item) {
			if (!item.isRendered) {
				itemContent = item.render();

				// Adding content to usual version
				tr = $(row({content: itemContent.full}));
				body.append(tr);

				// Adding content to mobile version
				me.mobiHireTable.append(itemContent.mobi);
			}
		});

		me.toggleEmpty();

		if (me.afterRender && _.isFunction(me.afterRender)) {
			me.afterRender();
		}
	};

	VacanciesList.prototype.toggleEmpty = function () {
		var me = this,
			noVacancies = $('#no-vacancies');

		noVacancies.remove();

		if (me.list.length === 0) {
			var emptyDiv = $(me.emptyTemplate({message: me.emptyMessage}));
			me.hireTable.parent().before(emptyDiv);
		}
	};

	/**
	 * If vacancies are small or not, then you need to add the class to the footer and make it tied to the bottom.
	 */
	VacanciesList.prototype.checkFooterPosition = function () {
		var me = this,
			footer = $('.smyt-footer');

		if (!isMobile && me.list.length < 4) {
			footer.addClass('smyt-footer-fixed');
		} else {
			footer.removeClass('smyt-footer-fixed');
		}
	};

	VacanciesList.prototype.add = function (vacancy) {
		this.list.push(vacancy);
	};

	VacanciesList.prototype.clear = function () {
		var me = this,
			body = me.hireTable.find('tbody');

		body.empty();
		me.mobiHireTable.empty();
		me.list = [];
	};

	VacanciesList.prototype.load = function (options) {
		var me = this,
			cb = options ? options.fn : undefined,
			params = options ? options.params : {};

		$.ajax({
			type: 'GET',
			url : me.loadUrl,
			data: params
		})
			.done(function (data) {
				if (data.success) {
                    // me.loadUrl = data.next ? data.next : me.saveLoadUrl;

                    me.clear();
                    for (var i = 0; i < data.results.length; i++) {
						me.add(new Vacancy(data.results[i]));
					}
					me.render();

				}
				else {
					showMessage(data);
				}

				if (cb) {
					cb(data);
				}
			})
			.fail(function (data) {
				showMessage(data);
			});
	};

    /**
     * Object for navigation on history vacancy searching and pagination.
     *
     * options - {
     *      popStateCallback: func
     * }
     *
     */
    function SearchHistoryLoader(options) {
        var me = this,
            defaults = {
                history: window.history,
                location: window.location,
                popStateCallback: null
            };

        _.assign(me, defaults);
        _.assign(me, options);

        // private functions

        function compareObjectProps(source, compared) {
            var isDiffer = false;

            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    if (!compared[prop] || source[prop] !== compared[prop]) {
                        isDiffer = true;
                        break;
                    }
                }
            }

            return isDiffer;
        }

        function isDiffer(params, filters) {
            var d1, d2;
            d1 = compareObjectProps(params, filters);
            d2 = compareObjectProps(filters, params);
            return d1 || d2;
        }

        function getSearchObject() {
            var search = window.location.search,
                query = search.length > 0 && search[0] === '?' ? search.substr(1) : '';

            return qs.parse(query);
        }

        function onPopWindowState(state) {
            var search = getSearchObject();
            if (me.popStateCallback && _.isFunction(me.popStateCallback)) {
                me.popStateCallback(me, search, state);
            }
        }

        function init() {
            window.onpopstate = onPopWindowState;
        }

        // public api

        me.changeHistoryState = function (search, filters, pagination) {
            var me = this,
                path = me.location.pathname,
                state,
                search = search || {},
                filters = filters || {},
                pagination = pagination || {},
                params;

                if (me.history.pushState) {

                    params = _.merge(filters, pagination);

                    if (isDiffer(search, params)) {
                        state = {
                            prev: search,
                            current: params
                        };

                        history.pushState(state, '', path + '?' + qs.stringify(params));
                    }
                }
        };

        me.replaceHistoryState = function(search, filters, pagination) {
            var me = this,
                path = me.location.pathname,
                state,
                params;

            params = _.merge(filters, pagination);

            state = {
                prev: search,
                current: params
            };

            history.replaceState(state, '', path + '?' + qs.stringify(params));
        };

        init();
    }

	// Loading next 20 vacancies and loading vacancy searching.
	(function () {
		var loadMoreBtn = $('#load-more'),
			searchForm = $('.search-vacancies-ajax'),
			moreUrl = loadMoreBtn.attr('data-load-url') || '/api/vacancies',
			filters = $('.select-filter'),
			params = {};

        if (moreUrl.indexOf('/?') !== -1) {
            moreUrl = moreUrl.substr(0, moreUrl.indexOf('/?'));
        }

        function getFilters() {
            var params = {};
            filters.each(function (index, item) {
                var value = $(item).val();
                if (value) {
				    params[$(item).attr('name')] = value;
                }
			});
            return params;
        }

        function setFilters(values) {
            filters.each(function (index, item) {
                var name = $(item).attr('name');
                if (_.has(values, name) && values[name] !== '') {
                    $(item).val(values[name]).trigger("change");
                } else {
                    $(item).val(null).trigger("change");
                }
			});
        }

        function getPagination() {
            var page = 2,
                search = getSearchObject();

            if (search.page) {
                page = parseInt(search.page) + 1;
            }

            return {page: String(page)};
        }

        function getSearchObject() {
            var search = window.location.search,
                query = search.length > 0 && search[0] === '?' ? search.substr(1) : '';

            return qs.parse(query);
        }

        function toggleLoadmore(data) {
            if (data.next === null || data.results.length === 0) {
                loadMoreBtn.hide();
            } else {
                loadMoreBtn.show();
            }
        }

        function onPopStateCallback(loader, search) {
            $.ajax({
                type: 'GET',
                url : moreUrl,
                data: search
            })
                .done(function (data) {
                    if (data.success) {

                        var list = data.results;

                        // Setting filters and button 'Load more'
                        setFilters(search);
                        toggleLoadmore(data);

                        // Redrawing vacancies
                        vacanciesStore.clear();
                        for (var i = 0; i < list.length; i++) {
                            vacanciesStore.add(new Vacancy(list[i]));
                        }
                        vacanciesStore.render();
                    }
                    else {
                        showMessage(data);
                    }
                })
                .fail(function (data) {
                    showMessage(data);
                });
        }

        function toggleFooterClass(footer, section) {
            var diff;

            if (footer.length && section.length) {
                diff = window.innerHeight - (footer[0].offsetHeight + section[0].offsetHeight + section[0].offsetTop);
            }

            if (!isMobile && diff && diff > 0) {
                footer.addClass('smyt-footer-fixed');
            } else {
                footer.removeClass('smyt-footer-fixed');
            }
        }

        /**
         * Object for history management.
         * @type {SearchHistoryLoader}
         */
        var vacanciesHistory = new SearchHistoryLoader({
            popStateCallback: onPopStateCallback
        });

        /**
         * Object for vacancies management.
         * @type {VacanciesList}
         */
		var vacanciesStore = new VacanciesList({
            history        : vacanciesHistory,
			hireTableId    : 'hire-table',
			mobiHireTableId: 'job-table-m',
			loadUrl        : moreUrl,
			emptyMessage   : gettext("While we don't have such vacancies, but send us your resume, and we'll think of something."),
            afterInit: function () {
				var me = this,
					footer = $('.smyt-footer'),
					section = $('#' + me.hireTableId).closest('.section');

                toggleFooterClass(footer, section);
            },
			afterRender    : function () {
				var me = this,
					footer = $('.smyt-footer'),
					section = $('#' + me.hireTableId).closest('.section');

                toggleFooterClass(footer, section);

				if (!me.scrollIsWatching) {
					$(window).on('resize orientationchange scroll', function () {
                        toggleFooterClass(footer, section);
					});
					me.scrollIsWatching = true;
				}
			}
		});

        /**
         * Loading vacancy list on button 'Load more'
         */
		loadMoreBtn.click(function () {
            var pagination = getPagination();
            params = _.merge(getFilters(), pagination);

			vacanciesStore.load({
				params: params,
				fn    : function (data) {
					// No vacancies
					if (data.next === null) {
						loadMoreBtn.hide();
					}

					var search = getSearchObject(),
                        filters = getFilters();

					vacanciesHistory.changeHistoryState(search, filters, pagination);
				}
			});
		});

         /**
         * Loading vacancy list by button 'Find' in Form
         */
		searchForm.attr('novalidate', 'novalidate').ajaxForm({
			data        : {
				'form-type': $form.attr("data-form-type") || "contact"
			},
			beforeSubmit: function (arr, $form, options) {
				if (isNoviBuilder) {
					return false;
				}
			},
			success     : function (result) {
				if (isNoviBuilder) {
					return;
				}

				if (result.success) {
					vacanciesStore.clear();
					for (var i = 0; i < result.results.length; i++) {
						vacanciesStore.add(new Vacancy(result.results[i]));
					}
					vacanciesStore.render();

					// If id doesn't vacancies, hide button
                    toggleLoadmore(result);

    				var search = getSearchObject(),
                        filters = getFilters(),
                        pagination = {page: '1'};

					vacanciesHistory.changeHistoryState(search, filters, pagination);

				} else {
					showMessage(result);
				}
			},
			error       : function (result) {
				if (isNoviBuilder) {
					return;
				}
				showMessage(result);
			}
		});

        // Initial replacing url on vacancy page
        if (window.location.pathname === '/vacancies/') {
            var initSearch = getSearchObject(),
                initFilters = getFilters(),
                pagination = {
                    page: '1'
                };

            if (initSearch.page) {
                pagination.page = initSearch.page;
                delete initSearch.page;
            }

            vacanciesHistory.replaceHistoryState(initSearch, initFilters, pagination);
        }
 	})();

});
