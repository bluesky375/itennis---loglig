(function ($) {

	$(function () {

		$(document).on('focus', 'input', function () {
			$('body').addClass('keyboard-open');
		});

	});
})(jQuery);