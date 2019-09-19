var $this;
var $target;
	var allPanels = $('.accordian-content').hide();
	$('.accordian-wrapper li:nth-child(2) .accordian-heading').addClass('active-title');
	$('.accordian-wrapper li:nth-child(2) .accordian-heading .plus').addClass('rotate-icon');
	$('.accordian-wrapper li:nth-child(2) .accordian-content').addClass('active').show();
	$('.plus').click(function() {	
		$('.accordian-heading').removeClass('active-title');					
		$(this).parent().addClass('active-title');					
		$this = $(this);					
		$target =  $this.parent().next();					
		if(!$target.hasClass('active')){						
			$('.plus').removeClass('rotate-icon');						
			$(this).addClass('rotate-icon');						
			allPanels.removeClass('active').slideUp();						
			$target.addClass('active').slideDown();					
		}					
		else{						
			$('.plus').removeClass('rotate-icon');										
			allPanels.removeClass('active').slideUp();						
			$('.accordian-heading').removeClass('active-title');					
		}		
		return false;
	});