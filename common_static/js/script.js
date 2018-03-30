/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
	initialDate = new Date(),

	$document = $(document),
	$window = $(window),
	$html = $("html"),

	isDesktop = $html.hasClass("desktop"),
	isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
	isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1,
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	isTouch = "ontouchstart" in window,
	onloadCaptchaCallback,
	plugins = {
		bootstrapDateTimePicker   : $("[data-time-picker]"),
		bootstrapModalDialog      : $('.modal'),
		bootstrapModalNotification: $('.notification'),
		bootstrapTabs             : $(".tabs-custom-init"),
		bootstrapTooltip          : $("[data-toggle='tooltip']"),
		campaignMonitor           : $('.campaign-mailform'),
		checkbox                  : $("input[type='checkbox']"),
		circleJPlayer             : $('.jp-player-circle-init'),
		circleProgress            : $(".progress-bar-circle"),
		countDown                 : $(".countdown"),
		counter                   : $(".counter"),
		customToggle              : $("[data-custom-toggle]"),
		dateCountdown             : $('.DateCountdown'),
		facebookWidget            : $('#fb-root'),
		instafeed                 : $(".instafeed"),
		isotope                   : $(".isotope"),
		jPlayer                   : $('.jp-jplayer'),
		jPlayerInit               : $('.jp-player-init'),
		jPlayerVideo              : $('.jp-video-init'),
		lightGallery              : $("[data-lightgallery='group']"),
		lightGalleryItem          : $("[data-lightgallery='item']"),
		mailchimp                 : $('.mailchimp-mailform'),
		owl                       : $(".owl-carousel"),
		pageLoader                : $(".page-loader"),
		pointerEvents             : isIE < 11 ? "js/pointer-events.min.js" : false,
		popover                   : $('[data-toggle="popover"]'),
		productThumb              : $(".product-thumbnails"),
		progressLinear            : $(".progress-linear"),
		radio                     : $("input[type='radio']"),
		rdGoogleMaps              : $(".rd-google-map"),
		rdInputLabel              : $(".form-label"),
		rdNavbar                  : $(".rd-navbar"),
		regula                    : $("[data-constraints]"),
		search                    : $(".rd-search"),
		searchResults             : $('.rd-search-results'),
		selectFilter              : $(".select-filter"),
		statefulButton            : $('.btn-stateful'),
		stepper                   : $("input[type='number']"),
		swiper                    : $(".swiper-slider"),
		twitterfeed               : $(".twitter"),
		viewAnimate               : $('.view-animate')
	},
    App = {};

/**
 * Initialize All Scripts
 */
$document.ready(function () {
	var isNoviBuilder = window.xMode;

	/**
	 * getSwiperHeight
	 * @description  calculate the height of swiper slider basing on data attr
	 */
	function getSwiperHeight(object, attr) {
		var val = object.attr("data-" + attr),
			dim;

		if (!val) {
			return undefined;
		}

		dim = val.match(/(px)|(%)|(vh)$/i);

		if (dim.length) {
			switch (dim[0]) {
				case "px":
					return parseFloat(val);
				case "vh":
					return $(window).height() * (parseFloat(val) / 100);
				case "%":
					return object.width() * (parseFloat(val) / 100);
			}
		} else {
			return undefined;
		}
	}

	/**
	 * toggleSwiperInnerVideos
	 * @description  toggle swiper videos on active slides
	 */
	function toggleSwiperInnerVideos(swiper) {
		var prevSlide = $(swiper.slides[swiper.previousIndex]),
			nextSlide = $(swiper.slides[swiper.activeIndex]),
			videos;

		prevSlide.find("video").each(function () {
			this.pause();
		});

		videos = nextSlide.find("video");
		if (videos.length) {
			videos.get(0).play();
		}
	}

	/**
	 * toggleSwiperCaptionAnimation
	 * @description  toggle swiper animations on active slides
	 */
	function toggleSwiperCaptionAnimation(swiper) {
		var prevSlide = $(swiper.container),
			nextSlide = $(swiper.slides[swiper.activeIndex]);

		prevSlide
			.find("[data-caption-animate]")
			.each(function () {
				var $this = $(this);
				$this
					.removeClass("animated")
					.removeClass($this.attr("data-caption-animate"))
					.addClass("not-animated");
			});

		nextSlide
			.find("[data-caption-animate]")
			.each(function () {
				var $this = $(this),
					delay = $this.attr("data-caption-delay");


				if (!isNoviBuilder) {
					setTimeout(function () {
						$this
							.removeClass("not-animated")
							.addClass($this.attr("data-caption-animate"))
							.addClass("animated");
					}, delay ? parseInt(delay) : 0);
				} else {
					$this
						.removeClass("not-animated")
				}
			});
	}

	/**
	 * initSwiperWaypoints
	 * @description  init waypoints on new slides
	 */
	function initSwiperWaypoints(swiper) {
		var prevSlide = $(swiper.container),
			nextSlide = $(swiper.slides[swiper.activeIndex]);

		prevSlide
			.find('[data-custom-scroll-to]')
			.each(function () {
				var $this = $(this);
				initCustomScrollTo($this);
			});

		nextSlide
			.find('[data-custom-scroll-to]')
			.each(function () {
				var $this = $(this);
				initCustomScrollTo($this);
			});
	}

	/**
	 * initCustomScrollTo
	 * @description  init smooth anchor animations
	 */
	function initCustomScrollTo(obj) {
		var $this = $(obj);
		if (!isNoviBuilder) {
			$this.on('click', function (e) {
				e.preventDefault();
				$("body, html").stop().animate({
					scrollTop: $($(this).attr('data-custom-scroll-to')).offset().top
				}, 1000, function () {
					$window.trigger("resize");
				});
			});
		}
	}

	/**
	 * initOwlCarousel
	 * @description  Init owl carousel plugin
	 */
	function initOwlCarousel(c) {
		var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-"],
			values = [0, 480, 768, 992, 1200, 1600],
			responsive = {},
			j, k;

		for (j = 0; j < values.length; j++) {
			responsive[values[j]] = {};
			for (k = j; k >= -1; k--) {
				if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
					responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"));
				}
				if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
					responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"));
				}
				if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
					responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"));
				}
			}
		}

		// Enable custom pagination
		if (c.attr('data-dots-custom')) {
			c.on("initialized.owl.carousel", function (event) {
				var carousel = $(event.currentTarget),
					customPag = $(carousel.attr("data-dots-custom")),
					active = 0;

				if (carousel.attr('data-active')) {
					active = parseInt(carousel.attr('data-active'));
				}

				carousel.trigger('to.owl.carousel', [active, 300, true]);
				customPag.find("[data-owl-item='" + active + "']").addClass("active");

				customPag.find("[data-owl-item]").on('click', function (e) {
					e.preventDefault();
					carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item")), 300, true]);
				});

				carousel.on("translate.owl.carousel", function (event) {
					customPag.find(".active").removeClass("active");
					customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
				});
			});
		}

		if (c.attr('data-nav-custom')) {
			c.on("initialized.owl.carousel", function (event) {
				var carousel = $(event.currentTarget),
					customNav = $(carousel.attr("data-nav-custom"));

				// Custom Navigation Events
				customNav.find(".owl-arrow-next").click(function (e) {
					e.preventDefault();
					carousel.trigger('next.owl.carousel');
				});
				customNav.find(".owl-arrow-prev").click(function (e) {
					e.preventDefault();
					carousel.trigger('prev.owl.carousel');
				});
			});
		}

		c.owlCarousel({
			autoplay     : c.attr("data-autoplay") === "true",
			loop         : isNoviBuilder ? false : c.attr('data-loop') == 'true',
			items        : 1,
			center       : c.attr("data-center-mod") || false,
			dotsContainer: c.attr("data-pagination-class") || false,
			navContainer : c.attr("data-navigation-class") || false,
			mouseDrag    : isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
			nav          : c.attr("data-nav") === "true" && !c.attr('data-nav-custom'),
			dots         : c.attr("data-dots") === "true",
			dotsEach     : c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
			animateIn    : c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
			animateOut   : c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
			responsive   : responsive,
			navText      : $.parseJSON(c.attr("data-nav-text")) || [],
			navClass     : $.parseJSON(c.attr("data-nav-class")) || ['owl-prev', 'owl-next']
		});
	}

	/**
	 * isScrolledIntoView
	 * @description  check the element whas been scrolled into the view
	 */
	function isScrolledIntoView(elem) {
		if (!isNoviBuilder) {
			return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
		}
		else {
			return true;
		}
	}

	/**
	 * Parallax text
	 * @description  function for parallax text
	 */
	function scrollText($this) {
		var translate = (scrollTop - $($this).data('orig-offset')) / $window.height() * 35;
		$($this).css({transform: 'translate3d(0,' + translate + '%' + ', 0)'});
	}

	/**
	 * initOnView
	 * @description  calls a function when element has been scrolled into the view
	 */
	function lazyInit(element, func) {
		var $win = jQuery(window);
		$win.on('load scroll', function () {
			if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
				func.call();
				element.addClass('lazy-loaded');
			}
		});
	}

	/**
	 * attachFormValidator
	 * @description  attach form validation to elements
	 */
	function attachFormValidator(elements) {

		for (var i = 0; i < elements.length; i++) {
			var o = $(elements[i]), v;
			o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
			v = o.parent().find(".form-validation");
			if (v.is(":last-child")) {
				o.addClass("form-control-last-child");
			}
		}

		/**
		 * Smyt checks
		 */
		regula.custom({
			name: "Phone",
			defaultMessage: "Неверный формат ввода номера, допустимые символы 0123456789+. Убедитесь, что номер введен без пробелов и его длина составляет от 6 до 20 символов",
			validator: function() {
				var regex = /(^\+?[0-9]{6,20}$)|(^.+@.+\..+$)/g;
				if (this.value != '') {
					return regex.test(this.value);
				}
				return true;
			}
		});

		regula.custom({
			name: "Name",
			defaultMessage: "Введите корректные данные",
			validator: function() {
				var regex = /^[a-zA-Zа-яА-Я\s]+$/g;
				if (this.value != '') {
					return regex.test(this.value);
				}
				return true;
			}
		});

		regula.custom({
			name: "Skype",
			defaultMessage: "Введите верный логин Skype",
			validator: function() {
				var regex = /^[a-zA-Z\d.:\-_]+$/g;

				if (this.value != '') {
					return regex.test(this.value);
				}
				return true;
			}
		});

		regula.custom({
			name: "Http",
			defaultMessage: "Введите корректные данные",
			validator: function() {
				var regex = /^(https?:\/\/)?([\da-zа-я\.-]+)\.([a-zа-я\.]{2,6})([\/\w \.-]*)*\/?$/g;
				if (this.value != '') {
					return regex.test(this.value);
				}
				return true;
			}
		});

		regula.custom({
			name: "ProfileFileExt",
			defaultMessage: "Неверное расширение файла",
			params: ['extensions'],
			validator: function(params) {
				var me = this,
					filesExt = params.extensions.split(','),
					parts;

				if (me.value !== '') {
					parts = me.value.split('.');
					return filesExt.indexOf(parts[parts.length - 1]) !== -1;
				}

				return true;
			}
		});

		regula.custom({
			name: "Together",
			// params: ['linkField'],
			defaultMessage: "{message}",
			validator: function(params) {
				var me = this,
					key = $(me).attr('data-link-field'),
					// $field = $('#' + params.linkField);
					$field = $('#' + key);

				if ($field) {
					return  $field.val() !== '' || me.value !== '';
				}

				return true;
			}
		});

		function formatSizeUnits(bytes) {
			if (bytes >= 1073741824) {
				bytes = (bytes / 1073741824).toFixed(2) + ' GB';
			}
			else if (bytes >= 1048576) {
				bytes = (bytes / 1048576).toFixed(2) + ' MB';
			}
			else if (bytes >= 1024) {
				bytes = (bytes / 1024).toFixed(2) + ' KB';
			}
			else if (bytes > 1) {
				bytes = bytes + ' bytes';
			}
			else if (bytes === 1) {
				bytes = bytes + ' byte';
			}
			else {
				bytes = '0 byte';
			}
			return bytes;
		}

		regula.custom({
			name          : "FileSize",
			defaultMessage: "{message}",
			validator     : function(params) {
				var me = this,
					file = me.files.length > 0 ? me.files[0] : null,
					mega = 1 * 1024 * 1024,
					maxSize;

				if (me.value !== '') {
					maxSize = params.maxFileSize ? Math.round(parseFloat(params.maxFileSize)) : mega;

					if (file && file.size > maxSize) {
						params.message = 'Файл слишком большой! Максимальный размер файла ' + formatSizeUnits(maxSize);
						return false;
					}
				}

				return true;
			}
		});

		elements
			.on('input change propertychange blur', function (e) {
				var $this = $(this);

				function checkField(field, checks) {
					var i;
					if (checks.length) {
						for (i = 0; i < checks.length; i++) {
							field.siblings(".form-validation").text(checks[i].message).parent().addClass("has-error")
						}
					} else {
						field.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (e.type != "blur") {
					if (!$this.parent().hasClass("has-error")) {
						return;
					}
				}

				if ($this.parents('.rd-mailform').hasClass('success')) {
					return;
				}

				checkField($this, $this.regula('validate'));

				// Добавляем запуск проверки связанных полей (проверка @Together)
				var linkField = $this.attr('data-link-field');
				if (linkField) {
					var $linkField = $('#' + linkField);
					checkField($linkField, $linkField.regula('validate'));
				}
			})
			.regula('bind');

		var regularConstraintsMessages = [
			{
				type      : regula.Constraint.Required,
				newMessage: "Данное поле является обязательным для заполнения"
			},
			{
				type      : regula.Constraint.Email,
				newMessage: "Неверный формат e-mail, убедитесь что он соответствует шаблону xxxxx@xxxxx.xxx"
			},
			{
				type      : regula.Constraint.Numeric,
				newMessage: "Разрешены только числа"
			},
			{
				type      : regula.Constraint.Selected,
				newMessage: "Выберите вариант"
			}
		];

		for (var i = 0; i < regularConstraintsMessages.length; i++) {
			var regularConstraint = regularConstraintsMessages[i];

			regula.override({
				constraintType: regularConstraint.type,
				defaultMessage: regularConstraint.newMessage
			});
		}
	}

	/**
	 * isValidated
	 * @description  check if all elemnts pass validation
	 */
	function isValidated(elements, captcha) {
		var results, errors = 0, k, j;

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
	 * Init Bootstrap tooltip
	 * @description  calls a function when need to init bootstrap tooltips
	 */
	function initBootstrapTooltip(tooltipPlacement) {
		if (window.innerWidth < 599) {
			plugins.bootstrapTooltip.tooltip('destroy');
			plugins.bootstrapTooltip.tooltip({
				placement: 'bottom'
			});
		} else {
			plugins.bootstrapTooltip.tooltip('destroy');
			plugins.bootstrapTooltip.tooltip({
				placement: tooltipPlacement
			});
		}
	}

	/**
	 * Page loader
	 * @description Enables Page loader
	 */
	if (plugins.pageLoader.length > 0) {
		$window.on("load", function () {
			setTimeout(function () {
				plugins.pageLoader.addClass("loaded");
				plugins.pageLoader.fadeOut(300, function () {
					$(this).remove();
				});

				$window.trigger("resize");
			}, 500);
		});
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
				.html('Please, prove that you are not robot.')
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
	 * Is Mac os
	 * @description  add additional class on html if mac os.
	 */
	if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");

	/**
	 * Is Safari
	 * @description  add additional class on html if safari.
	 */
	if (isSafari) $html.addClass("safari");

	/**
	 * IE Polyfills
	 * @description  Adds some loosing functionality to IE browsers
	 */
	if (isIE) {
		if (isIE < 10) {
			$html.addClass("lt-ie-10");
		}

		if (isIE < 11) {
			if (plugins.pointerEvents) {
				$.getScript(plugins.pointerEvents)
					.done(function () {
						$html.addClass("ie-10");
						PointerEventsPolyfill.initialize({});
					});
			}
		}

		if (isIE === 11) {
			$("html").addClass("ie-11");
		}

		if (isIE === 12) {
			$("html").addClass("ie-edge");
		}
	}

	/**
	 * Bootstrap Tooltips
	 * @description Activate Bootstrap Tooltips
	 */
	if (plugins.bootstrapTooltip.length && !isNoviBuilder) {
		var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
		initBootstrapTooltip(tooltipPlacement);
		$(window).on('resize orientationchange', function () {
			initBootstrapTooltip(tooltipPlacement);
		})
	}

	/**
	 * bootstrapModalDialog
	 * @description Stop video in bootstrapModalDialog
	 */
	if (plugins.bootstrapModalDialog.length > 0) {
		var i = 0;

		for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
			var modalItem = $(plugins.bootstrapModalDialog[i]);

			modalItem.on('hidden.bs.modal', $.proxy(function () {
				var activeModal = $(this),
					rdVideoInside = activeModal.find('video'),
					youTubeVideoInside = activeModal.find('iframe');

				if (rdVideoInside.length) {
					rdVideoInside[0].pause();
				}

				if (youTubeVideoInside.length) {
					var videoUrl = youTubeVideoInside.attr('src');

					youTubeVideoInside
						.attr('src', '')
						.attr('src', videoUrl);
				}
			}, modalItem))
		}
	}

	/**
	 * Radio
	 * @description Add custom styling options for input[type="radio"]
	 */
	if (plugins.radio.length) {
		var i;
		for (i = 0; i < plugins.radio.length; i++) {
			var $this = $(plugins.radio[i]);
			$this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
		}
	}

	/**
	 * Checkbox
	 * @description Add custom styling options for input[type="checkbox"]
	 */
	if (plugins.checkbox.length) {
		var i;
		for (i = 0; i < plugins.checkbox.length; i++) {
			var $this = $(plugins.checkbox[i]);
			$this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
		}
	}

	/**
	 * Popovers
	 * @description Enables Popovers plugin
	 */
	if (plugins.popover.length) {
		if (window.innerWidth < 767) {
			plugins.popover.attr('data-placement', 'bottom');
			plugins.popover.popover();
		}
		else {
			plugins.popover.popover();
		}
	}

	/**
	 * Bootstrap Buttons
	 * @description  Enable Bootstrap Buttons plugin
	 */
	if (plugins.statefulButton.length) {
		$(plugins.statefulButton).on('click', function () {
			var statefulButtonLoading = $(this).button('loading');

			setTimeout(function () {
				statefulButtonLoading.button('reset')
			}, 2000);
		})
	}

	/**
	 * UI To Top
	 * @description Enables ToTop Button
	 */
	if (isDesktop && !isNoviBuilder) {
		$().UItoTop({
			easingType    : 'easeOutQuart',
			containerClass: 'ui-to-top'
		});
	}

	/**
	 * RD Navbar
	 * @description Enables RD Navbar plugin
	 */
	if (plugins.rdNavbar.length) {
		for (i = 0; i < plugins.rdNavbar.length; i++) {
			var $currentNavbar = $(plugins.rdNavbar[i]);
			$currentNavbar.RDNavbar({
				stickUpClone: ($currentNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $currentNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive  : {
					0   : {
						stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-stick-up") === 'true' : false
					},
					768 : {
						stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-sm-stick-up") === 'true' : false
					},
					992 : {
						stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-md-stick-up") === 'true' : false
					},
					1200: {
						stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-lg-stick-up") === 'true' : false
					}
				},
				// callbacks   : {
				// 	onStuck       : function () {
				// 		var navbarSearch = this.$element.find('.rd-search input');
				//
				// 		if (navbarSearch) {
				// 			navbarSearch.val('').trigger('propertychange');
				// 		}
				// 	},
				// 	onUnstuck     : function () {
				// 		if (this.$clone === null)
				// 			return;
				//
				// 		var navbarSearch = this.$clone.find('.rd-search input');
				//
				// 		if (navbarSearch) {
				// 			navbarSearch.val('').trigger('propertychange');
				// 			navbarSearch.blur();
				// 		}
				// 	},
				// 	onDropdownOver: function () {
				// 		return !isNoviBuilder;
				// 	}
				// }
			});
			if (plugins.rdNavbar.attr("data-body-class")) {
				document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
			}
		}
	}

	/**
	 * ViewPort Universal
	 * @description Add class in viewport
	 */
	if (plugins.viewAnimate.length) {
		var i;
		for (i = 0; i < plugins.viewAnimate.length; i++) {
			var $view = $(plugins.viewAnimate[i]).not('.active');
			$document.on("scroll", $.proxy(function () {
				if (isScrolledIntoView(this)) {
					this.addClass("active");
				}
			}, $view))
				.trigger("scroll");
		}
	}

	/**
	 * Bootstrap tabs
	 * @description Activate Bootstrap Tabs
	 */
	if (plugins.bootstrapTabs.length) {
		var i;
		for (i = 0; i < plugins.bootstrapTabs.length; i++) {
			var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

			//If have owl carousel inside tab - resize owl carousel on click
			if (bootstrapTabsItem.find('.owl-carousel').length) {
				// init first open tab

				var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.active .owl-carousel');

				initOwlCarousel(carouselObj);

				//init owl carousel on tab change
				bootstrapTabsItem.find('.nav-custom a').on('click', $.proxy(function () {
					var $this = $(this);

					$this.find('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
					$this.find('.owl-carousel').find('.owl-stage-outer').children().unwrap();

					setTimeout(function () {
						var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel');

						if (carouselObj.length) {
							for (var j = 0; j < carouselObj.length; j++) {
								var carouselItem = $(carouselObj[j]);
								initOwlCarousel(carouselItem);
							}
						}

					}, isNoviBuilder ? 1500 : 300);

				}, bootstrapTabsItem));
			}
		}
	}


	/**
	 * RD Input Label
	 * @description Enables RD Input Label Plugin
	 */
	if (plugins.rdInputLabel.length) {
		plugins.rdInputLabel.RDInputLabel();
	}

	/**
	 * Regula
	 * @description Enables Regula plugin
	 */
	if (plugins.regula.length) {
		attachFormValidator(plugins.regula);
	}

	/**
	 * MailChimp Ajax subscription
	 */
	if (plugins.mailchimp.length) {
		$.each(plugins.mailchimp, function (index, form) {
			var $form = $(form),
				$email = $form.find('input[type=email]'),
				$output = $("#" + plugins.mailchimp.attr("data-form-output"));

			// Required by MailChimp
			$form.attr('novalidate', 'true');
			$email.attr('name', 'EMAIL');

			$form.submit(function (e) {
				var data = {},
					url = $form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
					dataArray = $form.serializeArray();

				$.each(dataArray, function (index, item) {
					data[item.name] = item.value;
				});

				$.ajax({
					data      : data,
					url       : url,
					dataType  : 'jsonp',
					error     : function (resp, text) {
						$output.html('Server error: ' + text);

						setTimeout(function () {
							$output.removeClass("active");
						}, 4000);
					},
					success   : function (resp) {
						$output.html(resp.msg).addClass('active');

						setTimeout(function () {
							$output.removeClass("active");
						}, 6000);
					},
					beforeSend: function (data) {
						// Stop request if builder or inputs are invalide
						if (isNoviBuilder || !isValidated($form.find('[data-constraints]')))
							return false;

						$output.html('Submitting...').addClass('active');
					}
				});

				return false;
			});
		});
	}


	/**
	 * Campaign Monitor ajax subscription
	 */
	if (plugins.campaignMonitor.length) {
		$.each(plugins.campaignMonitor, function (index, form) {
			var $form = $(form),
				$output = $("#" + plugins.campaignMonitor.attr("data-form-output"));

			$form.submit(function (e) {
				var data = {},
					url = $form.attr('action'),
					dataArray = $form.serializeArray();

				$.each(dataArray, function (index, item) {
					data[item.name] = item.value;
				});

				$.ajax({
					data      : data,
					url       : url,
					dataType  : 'jsonp',
					error     : function (resp, text) {
						$output.html('Server error: ' + text);

						setTimeout(function () {
							$output.removeClass("active");
						}, 4000);
					},
					success   : function (resp) {
						console.log(resp);

						$output.html(resp.Message).addClass('active');

						setTimeout(function () {
							$output.removeClass("active");
						}, 6000);
					},
					beforeSend: function (data) {
						// Stop request if builder or inputs are invalide
						if (isNoviBuilder || !isValidated($form.find('[data-constraints]')))
							return false;

						$output.html('Submitting...').addClass('active');
					}
				});

				return false;
			});
		});
	}

	/**
	 * lightGallery
	 * @description Enables lightGallery plugin
	 */
	if (plugins.lightGallery.length && !isNoviBuilder) {
		plugins.lightGallery.lightGallery({
			thumbnail : true,
			download  : false,
			actualSize: false,
			selector  : "[data-lightgallery='group-item']"
		});
	}

	if (plugins.lightGalleryItem.length && !isNoviBuilder) {
		plugins.lightGalleryItem.lightGallery({
			selector  : "this",
			download  : false,
			actualSize: false
		});
	}

	/**
	 * Custom Toggles
	 */
	if (plugins.customToggle.length) {
		for (i = 0; i < plugins.customToggle.length; i++) {
			var $this = $(plugins.customToggle[i]);

			$this.on('click', $.proxy(function (event) {
				event.preventDefault();
				var $ctx = $(this);
				$($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
			}, $this));

			if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
				$("body").on("click", $this, function (e) {
					if (e.target !== e.data[0]
						&& $(e.data.attr('data-custom-toggle')).find($(e.target)).length
						&& e.data.find($(e.target)).length == 0) {
						$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
					}
				})
			}
		}
	}

	/**
	 * jQuery Count To
	 * @description Enables Count To plugin
	 */
	if (plugins.counter.length) {
		var i;

		for (i = 0; i < plugins.counter.length; i++) {
			var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
			$document
				.on("scroll", $.proxy(function () {
					var $this = this;

					if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
						$this.countTo({
							refreshInterval: 40,
							from           : 0,
							to             : parseInt($this.text(), 10),
							speed          : $this.attr("data-speed") || 1000,
							formatter      : function (value, options) {
								value = value.toFixed(options.decimals);
								if (value > 10000) {
									var newValue = "",
										stringValue = value.toString();

									for (var k = stringValue.length; k >= 0; k -= 3) {
										if (k <= 3) {
											newValue = ' ' + stringValue.slice(0, k) + newValue;
										} else {
											newValue = ' ' + stringValue.slice(k - 3, k) + newValue;
										}
									}

									return newValue;
								} else {

									return value;
								}
							}
						});
						$this.addClass('animated');
					}
				}, $counterNotAnimated))
				.trigger("scroll");
		}
	}

	/**
	 * TimeCircles
	 * @description  Enable TimeCircles plugin
	 */
	if (plugins.dateCountdown.length) {
		var i;
		for (i = 0; i < plugins.dateCountdown.length; i++) {
			var dateCountdownItem = $(plugins.dateCountdown[i]),
				time = {
					"Days"   : {
						"text": "Days",
						"show": true,
						color : dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
					},
					"Hours"  : {
						"text": "Hours",
						"show": true,
						color : dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
					},
					"Minutes": {
						"text": "Minutes",
						"show": true,
						color : dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
					},
					"Seconds": {
						"text": "Seconds",
						"show": true,
						color : dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
					}
				};

			dateCountdownItem.TimeCircles({
				color          : dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "rgba(247, 247, 247, 1)",
				animation      : "smooth",
				bg_width       : dateCountdownItem.attr("data-bg-width") ? dateCountdownItem.attr("data-bg-width") : 0.6,
				circle_bg_color: dateCountdownItem.attr("data-bg") ? dateCountdownItem.attr("data-bg") : "rgba(0, 0, 0, 1)",
				fg_width       : dateCountdownItem.attr("data-width") ? dateCountdownItem.attr("data-width") : 0.03
			});

			$(window).on('load resize orientationchange', function () {
				if (window.innerWidth < 479) {
					this.dateCountdownItem.TimeCircles({
						time: {
							"Days"   : {
								"text": "Days",
								"show": true,
								color : this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							"Hours"  : {
								"text": "Hours",
								"show": true,
								color : this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							"Minutes": {
								"text": "Minutes",
								"show": true,
								color : this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							Seconds  : {
								"text": "Seconds",
								show  : false,
								color : this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							}
						}
					}).rebuild();
				} else if (window.innerWidth < 767) {
					this.dateCountdownItem.TimeCircles({
						time: {
							"Days"   : {
								"text": "Days",
								"show": true,
								color : this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							"Hours"  : {
								"text": "Hours",
								"show": true,
								color : this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							"Minutes": {
								"text": "Minutes",
								"show": true,
								color : this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							},
							Seconds  : {
								text : '',
								show : false,
								color: this.dateCountdownItem.attr("data-color") ? this.dateCountdownItem.attr("data-color") : "#f9f9f9"
							}
						}
					}).rebuild();
				} else {
					this.dateCountdownItem.TimeCircles({time: this.time}).rebuild();
				}
			}.bind({dateCountdownItem: dateCountdownItem, time: time}));
		}
	}

	/**
	 * Circle Progress
	 * @description Enable Circle Progress plugin
	 */
	if (plugins.circleProgress.length) {
		var i;
		for (i = 0; i < plugins.circleProgress.length; i++) {
			var circleProgressItem = $(plugins.circleProgress[i]);
			$document
				.on("scroll", $.proxy(function () {
					var $this = $(this);

					if (!$this.hasClass('animated') && isScrolledIntoView($this)) {

						var arrayGradients = $this.attr('data-gradient').split(",");

						$this.circleProgress({
							value     : $this.attr('data-value'),
							size      : $this.attr('data-size') ? $this.attr('data-size') : 175,
							lineCap   : $this.attr('data-line-cap') ? $this.attr('data-line-cap') : 'butt',
							fill      : {gradient: arrayGradients, gradientAngle: Math.PI / 4},
							startAngle: -Math.PI / 4 * 2,
							emptyFill : $this.attr('data-empty-fill') ? $this.attr('data-empty-fill') : "rgb(245,245,245)",
							thickness : $this.attr('data-thickness') ? parseInt($this.attr('data-thickness')) : 10,

						}).on('circle-animation-progress', function (event, progress, stepValue) {
							$(this).find('.radial').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
						});
						$this.addClass('animated');
					}
				}, circleProgressItem))
				.trigger("scroll");
		}
	}

	/**
	 * Linear Progress bar
	 * @description  Enable progress bar
	 */
	if (plugins.progressLinear.length) {
		for (i = 0; i < plugins.progressLinear.length; i++) {
			var progressBar = $(plugins.progressLinear[i]);
			$window
				.on("scroll load", $.proxy(function () {
					var bar = $(this);
					if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
						var end = parseInt($(this).find('.progress-value').text(), 10);
						bar.find('.progress-bar-linear').css({width: end + '%'});
						bar.find('.progress-value').countTo({
							refreshInterval: 40,
							from           : 0,
							to             : end,
							speed          : 500
						});
						bar.addClass('animated-first');
					}
				}, progressBar));
		}
	}


	/**
	 * RD Instafeed JS
	 * @description Enables Instafeed JS
	 */
	if (plugins.instafeed.length > 0) {
		var i;
		for (i = 0; i < plugins.instafeed.length; i++) {
			var instafeedItem = $(plugins.instafeed[i]);
			instafeedItem.RDInstafeed({
				accessToken: '5526956400.ba4c844.c832b2a554764bc8a1c66c39e99687d7',
				clientId   : ' c832b2a554764bc8a1c66c39e99687d7',
				userId     : '5526956400',
				showLog    : false
			});
		}
	}

	/**
	 * Enable parallax by mouse
	 */
	var parallaxJs = document.getElementsByClassName('parallax-scene-js');
	if (parallaxJs && !isNoviBuilder) {
		for (var i = 0; i < parallaxJs.length; i++) {
			var scene = parallaxJs[i];
			new Parallax(scene);
		}
	}

    /**
	 * Select2
	 * @description Enables select2 plugin
	 */
	if (plugins.selectFilter.length) {
		var i;
		for (i = 0; i < plugins.selectFilter.length; i++) {
			var select = $(plugins.selectFilter[i]);

			select.select2({
				theme: "bootstrap",
				val  : null
			}).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
		}
	}

	/**
	 * Bootstrap Date time picker
	 */
	if (plugins.bootstrapDateTimePicker.length) {
		var i;
		for (i = 0; i < plugins.bootstrapDateTimePicker.length; i++) {
			var $dateTimePicker = $(plugins.bootstrapDateTimePicker[i]);
			var options = {};

			options['format'] = 'dddd DD MMMM YYYY - HH:mm';
			if ($dateTimePicker.attr("data-time-picker") == "date") {
				options['format'] = 'MM-DD-YYYY';
				options['minDate'] = new Date();
			} else if ($dateTimePicker.attr("data-time-picker") == "time") {
				options['format'] = 'HH:mm';
			}

			options["time"] = ($dateTimePicker.attr("data-time-picker") != "date");
			options["date"] = ($dateTimePicker.attr("data-time-picker") != "time");
			options["shortTime"] = true;

			$dateTimePicker.bootstrapMaterialDatePicker(options);
		}
	}

	/**
	 * Stepper
	 * @description Enables Stepper Plugin
	 */
	if (plugins.stepper.length) {
		plugins.stepper.stepper({
			labels: {
				up  : "",
				down: ""
			}
		});
	}

	/**
	 * jQuery Countdown
	 * @description  Enable countdown plugin
	 */
	if (plugins.countDown.length) {
		var i;
		for (i = 0; i < plugins.countDown.length; i++) {

			var countDownItem = plugins.countDown[i],
				d = new Date(),
				time = countDownItem.getAttribute('data-time'),
				type = countDownItem.getAttribute('data-type'), // {until | since}
				format = countDownItem.getAttribute('data-format') ? countDownItem.getAttribute('data-format') : 'YYYY/MM/DD hh:mm:ss',
				expiryText = countDownItem.getAttribute('data-expiry-text') ? countDownItem.getAttribute('data-expiry-text') : 'Countdown finished',
				labels = countDownItem.getAttribute('data-labels') ? countDownItem.getAttribute('data-labels') : '',
				layout = countDownItem.getAttribute('data-layout') ? countDownItem.getAttribute('data-layout') : '{yn} {yl} {on} {ol} {dn} {dl} {hnn}{sep}{mnn}{sep}{snn}',
				settings = [];


			if (labels.length > 0) {
				settings['labels'] = JSON.parse(labels);
			}

			d.setTime(Date.parse(time)).toLocaleString();
			settings[type] = d;
			settings['expiryText'] = expiryText;
			settings['format'] = format;
			settings['alwaysExpire'] = true;
			settings['padZeroes'] = true;
			settings['layout'] = layout;
			settings['onExpiry'] = function () {
				this.classList += ' countdown-expired';
				this.innerHtml = expiryText;
			};

			$(countDownItem).countdown(settings);
		}
	}

	/**
	 * WOW
	 * @description Enables Wow animation plugin
	 */
	if (isDesktop && !isNoviBuilder && $html.hasClass("wow-animation") && $(".wow").length) {
		new WOW().init();
	}

});