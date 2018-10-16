function getNextField($form){
	var j = 1;
	while( $form.find("input[name="+j+"]").length ){
		j++;
	}
	return j;
}

function fancyOpen(el){
    $.fancybox(el,{
    	padding:0,
    	fitToView: false,
        scrolling: 'no',
        beforeShow: function(){
			$(".fancybox-wrap").addClass("beforeShow");
			if( !device.mobile() ){
		    	$('html').addClass('fancybox-lock'); 
		    	$('.fancybox-overlay').html($('.fancybox-wrap')); 
		    }
		},
		afterShow: function(){
			$(".fancybox-wrap").removeClass("beforeShow");
			$(".fancybox-wrap").addClass("afterShow");
			setTimeout(function(){
                $('.fancybox-wrap').css({
                    'position':'absolute'
                });
                $('.fancybox-inner').css('height','auto');
            },200);
		},
		beforeClose: function(){
			$(".fancybox-wrap").removeClass("afterShow");
			$(".fancybox-wrap").addClass("beforeClose");
		},
		afterClose: function(){
			$(".fancybox-wrap").removeClass("beforeClose");
			$(".fancybox-wrap").addClass("afterClose");
		},
    }); 
    return false;
}

var customHandlers = [];

$(document).ready(function(){	
	var rePhone = /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
		tePhone = '+7 (999) 999-99-99';

	$.validator.addMethod('customPhone', function (value) {
		return rePhone.test(value);
	});

	$(".ajax").parents("form").each(function(){
		$(this).validate({
			rules: {
				email: 'email',
				phone: 'customPhone',
				"when":{ 
                	required:true
	            },
	            "nights":{ 
	                required:true
	            }
			},
			messages:{
	            "when": "Выберите вариант",
	            "nights": "Выберите вариант"
	        },
	        errorPlacement: function(error, element) {
	            if ( element.is(":radio") ){
	                error.addClass("visible-label");
	                error.appendTo('.b-error-placement');
	            }
	        }
		});
		if( $(this).find("input[name=phone]").length ){
			$(this).find("input[name=phone]").each(function(){
				var phoneMask = new IMask($(this)[0], {
		        	mask: '+{7} (000) 000-00-00',
		        	prepare: function(value, masked){
				    	if( value == 8 && masked._value.length == 0 ){
				    		return "+7 (";
				    	}

				    	if( value == 8 && masked._value == "+7 (" ){
				    		return "";
				    	}

				    	tmp = value.match(/[\d\+]*/g);
				    	if( tmp && tmp.length ){
				    		value = tmp.join("");
				    	}else{
				    		value = "";
				    	}
				    	return value;
				    }
		        });
			});
		}

	});

	function whenScroll(){
		var scroll = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
		if( customHandlers["onScroll"] ){
			customHandlers["onScroll"](scroll);
		}
	}
	$(window).scroll(whenScroll);
	whenScroll();

	$(".fancy").each(function(){
		var $popup = $($(this).attr("href")),
			$this = $(this);
		$this.fancybox({
	      	btnTpl : {
		      smallBtn   : '<button data-fancybox-close class="fancybox-close-small icon-cross" title="Закрыть"></button>'
		    },
		    autofocus: true,
			beforeShow: function(){
				if( $popup.find(".b-quiz").length ){
					$("body").addClass("quiz-open");
				}
				$(".fancybox-wrap").addClass("beforeShow");
				$popup.find(".custom-field").remove();
				if( $this.attr("data-value") ){
					var name = getNextField($popup.find("form"));
					$popup.find("form").append("<input type='hidden' class='custom-field' name='"+name+"' value='"+$this.attr("data-value")+"'/><input type='hidden' class='custom-field' name='"+name+"-name' value='"+$this.attr("data-name")+"'/>");
				}
				if( $this.attr("data-beforeShow") && customHandlers[$this.attr("data-beforeShow")] ){
					customHandlers[$this.attr("data-beforeShow")]($this);
				}
			},
			afterShow: function(){
				$(".fancybox-wrap").removeClass("beforeShow");
				$(".fancybox-wrap").addClass("afterShow");
				if( $this.attr("data-afterShow") && customHandlers[$this.attr("data-afterShow")] ){
					customHandlers[$this.attr("data-afterShow")]($this);
				}
				$popup.find("input[type='text'],input[type='number'],textarea").eq(0).focus();
			},
			beforeClose: function(){
				$(".fancybox-wrap").removeClass("afterShow");
				$(".fancybox-wrap").addClass("beforeClose");
				if( $this.attr("data-beforeClose") && customHandlers[$this.attr("data-beforeClose")] ){
					customHandlers[$this.attr("data-beforeClose")]($this);
				}
			},
			afterClose: function(){
				$(".fancybox-wrap").removeClass("beforeClose");
				$(".fancybox-wrap").addClass("afterClose");
				if( $this.attr("data-afterClose") && customHandlers[$this.attr("data-afterClose")] ){
					customHandlers[$this.attr("data-afterClose")]($this);
				}
				$("body").removeClass("quiz-open");
			}
		});
	});

	var open = false;
    $("body").on("mouseup", ".b-popup *, .b-popup", function(){
        open = true;
    });
    $("body").on("mousedown", ".fancybox-slide", function() {
        open = false;
    }).on("mouseup", ".fancybox-slide", function(){
        if( !open ){
            $.fancybox.close();
        }
    });

	$(".b-go").click(function(){
		var block = $( $(this).attr("data-block") ),
			off = $(this).attr("data-offset")||0,
			duration = $(this).attr("data-duration")||800;
		$("body, html").animate({
			scrollTop : block.offset().top-off
		},duration);
		return false;
	});

	$(".fancy-img").fancybox({
		padding : 0
	});

	$(".goal-click").click(function(){
		if( $(this).attr("data-goal") && ya !== null ){
			console.log("send goal: " + $(this).attr("data-goal"));
			ya.reachGoal($(this).attr("data-goal"));
		}
	});

	$(".ajax").parents("form").submit(function(){
  		if( $(this).find("input.error,select.error,textarea.error").length == 0 ){
  			var $this = $(this),
  				$thanks = $($this.attr("data-block"));

  			$this.find(".ajax").attr("onclick", "return false;");

  			if( $this.attr("data-beforeAjax") && customHandlers[$this.attr("data-beforeAjax")] ){
				customHandlers[$this.attr("data-beforeAjax")]($this);
			}

			if( $this.attr("data-goal") && ya !== null ){
				console.log("send goal: " + $this.attr("data-goal"));
				ya.reachGoal($this.attr("data-goal"));
			}

			$.fancybox.close();
			$(".b-preloader-link").click();

  			$.ajax({
			  	type: $(this).attr("method"),
			  	url: $(this).attr("action"),
			  	data:  $this.serialize(),
				success: function(msg){
					var $form;
					if( msg == "1" ){
						$link = $this.find(".b-thanks-link");
					}else{
						$link = $(".b-error-link");
					}

					if( $this.attr("data-afterAjax") && customHandlers[$this.attr("data-afterAjax")] ){
						customHandlers[$this.attr("data-afterAjax")]($this);
					}

					$.fancybox.close();
					$link.click();
				},
				error: function(){
					$.fancybox.close();
					$(".b-error-link").click();
				},
				complete: function(){
					$this.find(".ajax").removeAttr("onclick");
					$this.find("input[type=text],textarea").val("");
				}
			});
  		}else{
  			$(this).find("input[type='text'].error,select.error,textarea.error").eq(0).focus();
  		}
  		return false;
  	});

	$("body").on("click", ".ajax", function(){
		$(this).parents("form").submit();
		return false;
	});
});