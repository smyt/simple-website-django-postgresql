/**
 * Global variables
 */
"use strict";

/**
 * Initialize All Scripts
 */
$(document).ready(function () {

	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false;

	/**
	 * Smooth scroll
	 */
	(function () {

		var smoothScroll = function (target, event) {
			if (target.length) {
				if (event) {
					event.preventDefault();
				}

				$('html, body').animate({
					scrollTop: target.offset().top - 80
				}, 1000, 'swing', function () {
					var fShell = $('#footer-shell'),
						$page = $('#page');

					fShell.css('height', '65px');

					if ($page && isIE) {
						// var height =
						// console.log($page);
						// $page.css('height', '65px');
					}
				});
			}
		};

		if (location.hash) {
			var target = $(location.hash);
			var timeout = setTimeout(function () {
				smoothScroll(target);
				clearTimeout(timeout);
			}, 1000);
		}

		//$('a[href*="#"]')
		$('.scroll')
			.not('[href="#"]')
			.not('[href="#0"]')
			.click(function (event) {
				// On-page links
				if (
					location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
					&&
					location.hostname == this.hostname
				) {
					// Figure out element to scroll to
					var target = $(this.hash);
					target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
					smoothScroll(target, event);
				}
			});
	})();

	/**
	 * Upload button
	 */
	$(function () {
		var wrapper = $(".file_upload"),
			inp = wrapper.find("input"),
			btn = wrapper.find("button"),
			lbl = wrapper.find("div");

		// Crutches for the :focus style:
		btn.focus(function () {
			wrapper.addClass("focus");
		}).blur(function () {
			wrapper.removeClass("focus");
		});

		var file_api = !!(window.File && window.FileReader && window.FileList && window.Blob );

		btn.each(function (index, item) {
			$(item).click(function () {
				inp.get(index).click();
			});
		});

		lbl.each(function (index, item) {
			$(item).click(function () {
				inp.get(index).click();
			});
		});

		inp.each(function (index, item) {
			$(item).change(function () {
				var input = inp.get(index),
					label = lbl.get(index),
					button = btn.get(index),
					file_name;

				if (file_api && input.files[0]) {
					file_name = input.files[0].name;
				}
				else {
					file_name = $(input).val().replace("C:\\fakepath\\", '');
				}

				if (!file_name.length) {
					$(label).text('*.doc, *.docx, *.rtf, *.pdf');
					return;
				}

				if ($(label).is(":visible")) {
                    var labelText  = file_name.length > 15 ? file_name.substr(0, 15) + '...' : file_name;
					$(label).text(labelText);
					$(button).text("Прикрепить резюме");
				} else {
					$(button).text(file_name);
				}
			}).change();
		});
	});
	$(window).resize(function () {
		$(".file_upload input").triggerHandler("change");
	});

	/**
	 * Выравнивание по высоте колонок с описанием вакансий
	 */
	(function () {

		function doSameBoxesHeight(e, sh, eh) {
			var boxes = $('.box-info-inner'),
				titles = $('.box-info-title'),
				titlesHeight = [],
				boxesHeight = [],
				titleMax,
				boxesMax,
				padding = 0;

			// Сбрасываем высоту колонок
			titles.each(function (idx, item) {
				$(item).css('height', '');
			});

			boxes.each(function (idx, item) {
				$(item).css('height', '');
			});

			// Вычисляем самый высокий title
			titles.each(function (idx, item) {
				titlesHeight.push(item.clientHeight);
			});

			titleMax = _.max(titlesHeight);

			titles.each(function (idx, item) {
				$(item).css('height', titleMax + 'px');
			});

			// Вычисляем самый высокое описание
			boxes.each(function (idx, item) {
				boxesHeight.push(item.clientHeight);
			});

			padding = (_.uniq(boxesHeight).length !== 1) ? 20 : 0;

			boxesMax = _.max(boxesHeight);

			boxes.each(function (idx, item) {
				$(item).css('height', boxesMax + padding + 'px');
			});
		}

		$(window).on('resize', doSameBoxesHeight);
	})();

	/**
	 * Выравнивание формы контактов
	 */
	(function () {

		function doSameTopPosition() {
			var $askBtn = $('#ask-button'),
				$hrBtn = $('#hr-send-button'),
				$area = $('#form-2-message'),
				askBtnPos = $askBtn.offset(),
				hrBtnPos = $hrBtn.offset();

			if ($askBtn.length && $hrBtn.length) {
				if (Math.abs(askBtnPos.left - hrBtnPos.left) !== 0) {
					var diff = askBtnPos.top - hrBtnPos.top,
						height = $area[0].clientHeight;
					$area.css('height', +height - diff + 'px');
				}
			}
		}

		$(window).on('resize', doSameTopPosition);

	})();

	$(window).trigger('resize');

	/**
	 * События по открытию и закрытию модальных окон
	 */
	(function () {
		var $messageModal = $('#message-modal'),
			$profileModal = $('#profile-modal'),
			$html = $('html'),
			$nv = $('.rd-navbar'),
			$uiTop = $('.ui-to-top');


		function addRight() {
			$html.css('padding-right', '17px');
			$nv.css('width', 'calc(100vw - 17px)');
			$uiTop.hide();
		}

		function removeRight() {
			$html.css('padding-right', '');
			$uiTop.show();
		}

		if (!isMobile) {
			$messageModal.on('show.bs.modal', addRight);
			$messageModal.on('hidden.bs.modal', removeRight);

			$profileModal.on('show.bs.modal', addRight);
			$profileModal.on('hidden.bs.modal', removeRight);

            // Сброс формы при закрытии окна.
			$profileModal.on('hidden.bs.modal', function() {
                var form = $profileModal.find('.rd-mailform');
                if (form.length > 0) {
                    App.common.clearForm(form[0], {
                        removeClass: 'form-in-process',
                        addClass   : 'success',
                        hasCaptcha :  true
                    });
                }
            });
		}
	})();

	/**
	 * Выравнивание promo блоков по высоте на middle и large devices .
	 */
	(function () {

		function setPromoBoxesHeight(e, sh, eh) {
			var width = window.innerWidth,
				diff,
				maxHeight;

			if (width > 1200) {
				var freeStyle = $('#lg-promo-free-style'),
					remoteJob = $('#lg-promo-remote-job'),
					workPlace = $('#lg-promo-workplace'),
					schedule = $('#lg-promo-schedule'),
					english = $('#lg-promo-english'),
					smytMain = $('#lg-promo-main');

				maxHeight = schedule.outerHeight() + remoteJob.outerHeight() + workPlace.outerHeight() + 20;

				// Выравнивание внутренней колонки
				diff = (schedule.outerHeight() + remoteJob.outerHeight() + 10) - smytMain.outerHeight();
				smytMain.css('min-height', smytMain.outerHeight() + diff);

				// Выравнивание внешне левой колонки
				diff = maxHeight - (english.outerHeight() + freeStyle.outerHeight() + 10);
				freeStyle.css('min-height', freeStyle.outerHeight() + diff);
			}
			else if (width >= 768 && width <= 1200) {
				var mdFreeStyle = $('#md-promo-free-style'),
					mdEnglish = $('#md-promo-english'),
					mdRemoteJob = $('#md-promo-remote-job'),
					mdWorkPlace = $('#md-promo-workplace'),
					mdSchedule = $('#md-promo-schedule'),
					mdSmytMain = $('#md-promo-main');

				diff = mdSchedule.outerHeight() + mdRemoteJob.outerHeight() + mdWorkPlace.outerHeight() + mdFreeStyle.outerHeight()
					- mdEnglish.outerHeight() - mdSmytMain.outerHeight() + 20;

				mdEnglish.css('min-height', mdEnglish.outerHeight() + diff);
			}
		}

		$(window).on('resize', setPromoBoxesHeight);
	})();


	/**
	 * Выделение пункта меню контакты при скролинге до него.
	 */
	(function () {
		function onDocumentScroll() {
			var scroll_top = $(document).scrollTop(),
				link = $('#contacts'),
				target = $('#contacts-form');

			if (target.length > 0) {
                if (target.position().top < scroll_top + parseInt(link.attr('data-point-inc'))) {
                    link.parent().addClass("active");
                } else {
                    link.parent().removeClass("active");
                }
            }
		}

		$(document).on("scroll", onDocumentScroll);
	})();

});
