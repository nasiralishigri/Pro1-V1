$(document).ready(function() {
  $('.tl_btns li').click(function() {
	$('.tl_c-w .tl_c').removeClass('active').eq($(this).index()).addClass('active');
});

(function($) {
	function mediaSize() { 
		/* desktop funciton */
		if (window.matchMedia('(min-width: 575px)').matches) {
			$('.tl_btns li.active').prevAll().addClass('active');
			$('.tl_c-w .tl_c').eq(this).addClass('active');
			$('.tl_btns li').click(function() {
        $('.tl_btns li').removeClass('original-active');
        $(this).addClass('active original-active');
				$(this).prevAll().addClass('active');
				$(this).nextAll().removeClass('active');
			});
			$('.tl_btns li').last().click(function() {
				$('.tl_btns').addClass('last');
			});
			$('.tl_btns li').click(function () {
				if($(this).is(':last-child'))
				{
					$('.tl_btns').addClass('last');
				}
				else{
					$('.tl_btns').removeClass('last');
				}
			});
		} 
    /* mobile funciton */
    else{
			$('.tl_btns li.active').not(":last").removeClass('active');
			$('.tl_btns li').click(function() {
				$('.tl_btns li').removeClass('active');
				$(this).addClass('active');
			});
		}
	};
	mediaSize();
	window.addEventListener('resize', mediaSize, false);  
})(jQuery);

});