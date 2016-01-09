(function($) {
	"use strict";

	$(document).ready(function() {

        // ====================================================================
        // Firebase connection

        var template = $('#guestbook-template').html();
        Mustache.parse(template);   // optional, speeds up future uses
        
        var myFirebaseRef = new Firebase("https://glaring-fire-7409.firebaseio.com/guestbook");
            myFirebaseRef.once("value", function(snap) {
                $('#guestbook-carousel').empty();
                var items = snap.val();
                for (var key in items) {
                    if (items.hasOwnProperty(key)) {
                        var element = items[key];
                        $('#guestbook-carousel').append(Mustache.render(template, element));
                    }
                }
                initGuestbookCarousel();
            });
        $('#guestbook-form').submit(function(e){
            e.preventDefault();
            var data = $('#guestbook-form').serializeObject();
            myFirebaseRef.push(data);
            window.location.reload();
        });
        
		// ====================================================================

		// Header scroll function

		$(window).scroll(function() {    
			var scroll = $(window).scrollTop();
			if (scroll > 0) {
				$("#home .navbar").removeClass("no-background");
			} else {
				$("#home .navbar").addClass("no-background");
			}
		});

		// ====================================================================

		// Smooth Scroll on Menu Click

		$('a[href^=#]').on("click",function(){
			var t= $(this.hash);
			var t=t.length&&t||$('[name='+this.hash.slice(1)+']');
			if(t.length){
				var tOffset=(t.offset().top);
				$('html,body').animate({scrollTop:tOffset},'slow');
				return false;
			}
		});

		// ====================================================================

		// Flex Menu

		$('.menu').flexMenu({
			breakpoint: 3000,
			responsivePattern: 'off-canvas',
			animationSpeed: 300
		});

		$(".fm-button").click(function(){
		     if($(this).css('left') == '0px'){
		       $(this).stop().animate({left:'240px'},300);
		     };
		     if($(this).css('left') == '240px'){
		        $(this).stop().animate({left:'0px'},300);
		     };
		 });

		// ====================================================================

		// Slider

		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("msie") != -1 || ua.indexOf("opera") != -1) {
			jQuery('body').css('overflow','hidden');
			jQuery('html').css('overflow','hidden');
		}	

		$('#bannerscollection_zoominout_opportune').bannerscollection_zoominout({
			skin: 'opportune',
			responsive:true,
			width: 1920,
			height: 1080,
			fadeSlides:true,
			width100Proc:true,
			height100Proc:true,
			showNavArrows:true,
			showBottomNav:true,
			autoHideBottomNav:true,
			thumbsWrapperMarginTop: -55,
			pauseOnMouseOver:false,
			enableTouchScreen:false,
			circleColor:"#bc2670"
		});

		// ====================================================================

		// Wedding Couple

		$(".flipper.right .front .btn").click(function(){
			$(this).parent().stop().animate({left:'-100%'},300);
			$(this).parent().parent().find(".back").stop().animate({left:'0'},300);
		 });

		$(".flipper.right .back .btn").click(function(){
			$(this).parent().parent().stop().animate({left:'100%'},300);
			$(this).parent().parent().parent().find(".front").stop().animate({left:'0'},300);
		 });

        $(".flipper.left .front .btn").click(function(){
			$(this).parent().stop().animate({right:'-100%'},300);
			$(this).parent().parent().find(".back").stop().animate({right:'0'},300);
		 });

		$(".flipper.left .back .btn").click(function(){
			$(this).parent().parent().stop().animate({right:'100%'},300);
			$(this).parent().parent().parent().find(".front").stop().animate({right:'0'},300);
		 });

		// ====================================================================

		// Circular Countdown

		$('#countdown_clock').circularCountdown({
			strokeDaysBackgroundColor:'rgba(0,0,0,0.2)',
			strokeDaysColor:'#bc2670',
			strokeHoursBackgroundColor:'rgba(0,0,0,0.2)',
			strokeHoursColor:'#bc2670',
			strokeMinutesBackgroundColor:'rgba(0,0,0,0.2)',
			strokeMinutesColor:'#bc2670',
			strokeSecondsBackgroundColor:'rgba(0,0,0,0.2)',
			strokeSecondsColor:'#bc2670',
			strokeWidth:3,
			strokeBackgroundWidth:3,
			countdownEasing:'easeOutBounce',
			countdownTickSpeed:'slow',
			backgroundShadowColor: 'rgba(0,0,0,0.2)',
			backgroundShadowBlur: 0,
			strokeShadowColor: 'rgba(0,0,0,0.2)',
			strokeShadowBlur: 0
		});

		// ====================================================================

		// Carousels

		$("#people .owl-carousel").owlCarousel({
			margin: 40,
			loop: true,
			dots: false,
			autoplay: true,
			autoplaySpeed: 1500,
			nav: true,
			navText: ['<i class="fa fa-arrow-left fa-2x"></i>','<i class="fa fa-arrow-right fa-2x"></i>'],
			responsive:{
				0:{
					items:1
				},
				767:{
					items:2
				},
				992:{
					items:3
				},
				1200:{
					items:4
				},
				1600:{
					items:5
				}
			}
		});

		$("#blog .owl-carousel").owlCarousel({
			margin: 40,
			loop: true,
			dots: false,
			nav: true,
			navText: ['<i class="fa fa-arrow-left fa-2x"></i>','<i class="fa fa-arrow-right fa-2x"></i>'],
			responsive:{
				0:{
					items:1
				},
				767:{
					items:2
				},
				1200:{
					items:4
				}
			}
		});

		$("#registry .owl-carousel").owlCarousel({
			items: 3,
			margin: 60,
			loop: true,
			dots: true,
			nav: false,
			autoplay: true,
			autoplaySpeed: 3500,
			responsive:{
				0:{
					items:2
				},
				481:{
					items:3
				},
				767:{
					items:3
				},
				992:{
					items:3
				},
				1200:{
					items:3
				}
			}
		});
    
        function initGuestbookCarousel(){
        
            $("#guestbook-home .owl-carousel").owlCarousel({
                animateIn: 'flipInX',
                animateOut: 'fadeOutDown',
                items: 1,
                loop: true,
                dots: false,
                autoplay: true,
                autoplaySpeed: 1500,
                nav: false
            });
        }
		// ====================================================================

		// Direction Aware Hover Effect

		$('.gallery > li ').each( function() {
			$(this).hoverdir({
				hoverDelay : 75
			});
		});

		// ====================================================================

		// Flickr Feed

		$('#flickr').jflickrfeed({
			limit: 9,
			qstrings: {
				id: '89775615@N00'
			},
			itemTemplate: 
			'<li>' +
				'<a href="{{image_b}}" class="fancybox" rel="gallery"><img src="{{image_s}}" alt="{{title}}" /></a>' +
			'</li>'
		});

		// ====================================================================

		// Fancybox

		$('.fancybox').fancybox({
			openEffect: 'none'
		});

		// ====================================================================

		// Scroll Reveal

		window.sr = new scrollReveal({
			reset: true,
			move: '50px',
			mobile: false
        });

		// ====================================================================

	})

})(jQuery);