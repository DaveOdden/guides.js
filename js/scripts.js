$(function() {
	
	if(localStorage.getItem('menu-location') != null) {
		var menuObject = localStorage.getItem('menu-location');
		menuObject = JSON.parse(menuObject);
		$('#panel-menu').css({'top': menuObject.top, 'left': menuObject.left });
	}
	
	$('#panel-menu').draggable({
		stop:function(event,ui) {
			var menu_top = $(this).css('top');
			var menu_left = $(this).css('left');
			var menuObject = { 'top': menu_top, 'left': menu_left };
			localStorage.setItem('menu-location', JSON.stringify(menuObject));
		}
	});
	
	function guideCount(val) {
		if(val == '+') {
			$('.active-guides-count').html(parseInt($('#derived_guide_count').html())+1);
			//console.log(parseInt($('#derived_guide_count').html())+1);
		}
		else if(val == '-') {
			if(!$('.active-guides-count').html() == "0")
				$('.active-guides-count').html((parseInt($('#derived_guide_count').html())-1));
		}
		else {
			$('.active-guides-count').html(val);
		}
	}
	
	var guide_list = '';
	var active_guide_list = '';
	function allowDrag() {
		$( ".draggable:not(.ui-draggable)" ).draggable({
			axis: "y",
			start: function( even, ui ) {
				$(this).html("<span class='measurement'>"+top+"</span>");
				$(this).children('.measurement').css('-webkit-transform','translateX(0)');
			},
			drag: function( event, ui ) {
				var this_id = $(this).attr('id');
				var top = $('#'+this_id).css('top');
				//var top = $('#'+this_id).offset().top;
				$(this).children('.measurement').html(parseInt(top) - 35);
				$('#trash').addClass('exposed-trash');
			},
			stop:function( even, ui ) {
				var this_id = $(this).attr('id');
				var measure = $(this).children('.measurement').html();
				$(this).children('.measurement').css('-webkit-transform','translateX(-60px)');
				var top_value = $(this).css('top');
				//console.log('Moved Guide: ' + this_id + ' - Top Value: ' + top_value + ' (' + (parseInt(top_value) - 35) + 'px)');
				
				if(currently_hovered_over_trash === true) {
					var guide_count = $('.draggable').length;		
					$('#trash .icon').addClass('wobble');
					$('#trash .icon').removeClass('trash-hover');
					$(this).remove();					
					setTimeout(function() {
						$('#trash').removeClass('exposed-trash');
						$('#trash .icon').removeClass('wobble');
					},500);
					
					guideCount('-');
					//localStorage.removeItem('guide'+this_id); 
					
					var guide_pos_arr = [];
					$('.draggable').each(function(index) {
						guide_pos_arr.push($(this).css('top'));
						//console.log('Remaining Guides: ' + $(this).attr('id') + ' - Top Value: ' + $(this).css('top'));
						//var this_top_val = $('.draggable').eq(index).css('top');
					});
					
					$('.draggable').remove();
					
					var resort_incrementer = 0;
					while(localStorage.getItem('guide'+resort_incrementer) != null) {
						localStorage.removeItem('guide'+resort_incrementer);
						resort_incrementer++;
					}
					
					var html = '';	
					for(a=0;a<guide_pos_arr.length;a++) {
						//console.log('New Values: '+ a + ' '+ guide_pos_arr[a]);
						localStorage.setItem('guide'+a, guide_pos_arr[a]);
						html += "<div id='"+ a +"' class='draggable ui-widget-content' style='top: "+guide_pos_arr[a]+"'></div>";
					}
					
					$('body').prepend(html);
					
					allowDrag();
					
					
					
					
					/*
					var resort_incrementer = this_id;
					while(localStorage.getItem('guide'+resort_incrementer) != null) {
						localStorage.removeItem('guide'+resort_incrementer)
						resort_incrementer++;
					}
					
					var html = '';
					$('.draggable').each(function(index) {
						html += "<div id='"+ index +"' class='draggable ui-widget-content' style='top: "+$(this).css('top')+"'></div>";
					});
					
					$('.draggable').remove();
					$('body').prepend(html);
					
					$('.draggable').each(function(index) {
						console.log('test');
						localStorage.setItem('guide'+index, $(this).css('top'));
					});
					
					allowDrag();
					*/
				}
				else {
					//guide_list += $(this).attr('id') + ',';
					$('#trash').removeClass('exposed-trash');
					localStorage.setItem('guide'+this_id, top_value);
					//localStorage.setItem('active-guide-list', guide_list);
				}
			}
		});
	}
	
	function hideDropdown() {
		$('.menu-btn').removeClass('menu-item-highlighted ');
		$('#menu-dropdown').animate({opacity:0},300, function() { $('#menu-dropdown').hide() });
		this_button = '';
	}
	
	/**********************************************************

			INITIALIZE GUIDES FROM LOCAL STORAGE ON LOAD

	**********************************************************/
	
	var i = 0;
	while (localStorage.getItem('guide'+i) != null) {
		//console.log('local guide: ' + i + ' top val: ' + localStorage.getItem('guide'+i) + ' (' + ( parseInt(localStorage.getItem('guide'+i)) - 34) + ')');
		$('body').prepend("<div id='"+ i +"' class='draggable ui-widget-content' style='top: "+ localStorage.getItem('guide'+i) +"'></div>");
		i++;
		guideCount(i);
	}
	
	allowDrag();
	
	/**********************************************************

					HOVERED OVER TRASH ICON

	**********************************************************/
	
	var currently_hovered_over_trash = false;
	$('#trash').hover(function() {
		$(this).children('.icon').addClass( "trash-hover" );
		currently_hovered_over_trash = true;
	}, function() {
	    $(this).children('.icon').removeClass( "trash-hover" );
		currently_hovered_over_trash = false;
	});
	
	/**********************************************************

				MENU VIEW - FILE DROPDOWN FUNCTIONALITY

	**********************************************************/
	
	if(active_guide_list != null)
		var id_index = i;
	else
		var id_index = 0;
		
	$('.new-guide-button').bind('click',function(index) {
		$("<div id='"+ (id_index++) +"' class='draggable ui-widget-content' style='top:60px'></div>").insertAfter('#guides-js');
		guideCount('+');
		allowDrag();
		$('#menu-controls li').removeClass('menu-item-highlighted ');
		hideDropdown();
		this_button = '';	
	});
	
	var guides_visible = true;
	$('.hide-guide-button').bind('click',function(index) {
		if(guides_visible) {
			$('.draggable').hide();
			guides_visible = false;
			$(this).removeClass('hide').addClass('show').html('Show Guides (&#8984; + ;)');
		}
		else {
			$('.draggable').show();
			guides_visible = true;
			$(this).removeClass('show').addClass('hide').html('Hide Guides (&#8984; + ;)');
		}
		$('#menu-controls li').removeClass('menu-item-highlighted ');
		hideDropdown();
		this_button = '';
	});
	
	$('.remove-guides-button').bind('click',function() {
		$('.draggable').remove();
		localStorage.removeItem('active-guide-list');
		var d = 0;
		while (localStorage.getItem('guide'+d) != null) {
			localStorage.removeItem('guide'+d);
			d++;
		}	
		guideCount('0');
		$('#menu-controls li').removeClass('menu-item-highlighted ');
		hideDropdown();
		this_button = '';	
	});
	
	
	/**********************************************************

							KEY COMMANDS

	**********************************************************/
	
	var toggle_on = false;
	var command = false;
	var semicol = false;
	var menu_visible = true;
	$(document).keypress(function(e) {
		
		var keyCode = e.keyCode || e.which || event.keyCode || e.keyCode;
		
		if(event.which === 84) {
        }
		
		if(event.keyCode === 32) {
			e.preventDefault();
			if(toggle_on == false) {
				console.log('Toggle ON');
				$('#guide-spacing').addClass('checked');
				toggle_on = true;
				$('#guide-spacing-ind').html('ON');
			}
			else {
				console.log('Toggle OFF');
				toggle_on = false;
				$('#guide-spacing').removeClass('checked');
				$('#info-box').hide();
				$('#guide-spacing-ind').html('OFF');
			}
		}
		
		/*
		var keyCode = e.keyCode || e.which || event.keyCode || e.keyCode;
        if (keyCode == 84) {
			e.preventDefault();
			if(menu_visible) {
				$('#menu').hide();
				menu_visible = false;
			}
			else {
				$('#menu').show();
				menu_visible = true;
			}
        }
		*/  
		
	    if(e.keyCode==59) {
			semicol = true;
		}
		if(e.metaKey) {
			command = true;
		}
		//console.log(semicol + ' -- ' + command);
		if(semicol === true && command === true) {
			if(guides_visible) {
				$('.draggable, #info-box').hide();
				$('.hide-guide-button').removeClass('hide').addClass('show').html('Show Guides (&#8984; + ;)');
				
				//$('#guides-js').addClass('hidden-guides-js');
				//$('#guides-js').hide();
				guides_visible = false;
				command = false;
				semicol = false;
			}
			else {
				$('.draggable, #info-box').show();
				$('.hide-guide-button').removeClass('show').addClass('hide').html('Hide Guides (&#8984; + ;)');

				//$('#guides-js').removeClass('hidden-guides-js');
				//$('#guides-js').show();
				guides_visible = true;
				command = false;
				semicol = false;
			}
		}
	});
	
	/**********************************************************

			GUIDE SPACING - TRACKING MOUSE MOVEMENT

	**********************************************************/
	
	$('#guide-spacing').bind('click',function() {
		if(!(toggle_on && $(this).hasClass('checked'))) {
			toggle_on = true;
			$(this).addClass('checked');
			$('#info-box').show();
			hideDropdown();
		}
		else {
			toggle_on = false;
			$(this).removeClass('checked');
			$('#info-box').hide();
			hideDropdown();
		}
	});
	
	var mousePos;
	window.onmousemove = handleMouseMove;
   	setInterval(getMousePosition, 1500); // setInterval repeats every X ms

    function handleMouseMove(event) {
        event = event || window.event; // IE-ism
        mousePos = {
            x: event.clientX,
            y: event.clientY
        };
    }
	var first_time_through = true;
    function getMousePosition() {
		var top_val_array = [];
		var closest_guide_floor = 0;
		var closest_guide_ceiling = 0;
        var pos = mousePos;
        if (!pos) {
            // We haven't seen any movement yet
        }
        else {
			if(toggle_on == true) {
            	//console.log(pos.y);
				var nested_first_time_through = true;
				var nested_first_time_through_b = true;
				
				/* loop through each guide */
				$('.draggable').each(function() {
					
					var this_top_val = $(this).css('top');
					
					if(parseInt(this_top_val) > pos.y) {
						
						if(nested_first_time_through == true) {
							closest_guide_ceiling = parseInt(this_top_val);
							nested_first_time_through = false;
						}
						else {
												
						if(parseInt(this_top_val) < closest_guide_ceiling) {
							closest_guide_ceiling = parseInt(this_top_val);
						}
					  }
					}
					else {
						if(parseInt(this_top_val) > closest_guide_floor) {
							closest_guide_floor = parseInt(this_top_val);
						}
					}
					//console.log('closest guide to cursor floor: ' + closest_guide_floor);
					//console.log('closest guide to cursor ceiling: ' + closest_guide_ceiling);
					top_val_array.push(this_top_val);
				});
								
				if(first_time_through == true) {
					var left_of_cursor_pos = pos.x - 100;
					first_time_through = false;
				}

				var difference_height = parseInt(closest_guide_ceiling) - parseInt(closest_guide_floor);

				if(closest_guide_ceiling != 0 && closest_guide_floor != 0)  {
					if($('.draggable').length > 1) {
						$('#info-box').show();
						$('#info-box').css({'-webkit-transition':'all .5 ease','top':closest_guide_floor, 'height':difference_height+'px', '-webkit-transform':'translateX('+left_of_cursor_pos+'px)'});
						$('#info-box .value').html(difference_height+'px').css('top',''+((parseInt(difference_height)/2)-7)+'px');
					}
				}
				else {
					$('#info-box').hide();
				}
			}
        }
    }

	/**********************************************************

				FLOATING PANEL VIEW - ADVANCED GUIDES

	**********************************************************/

	var toggle_off = true;
	$('#advanced-guides').hide();
	$('.toggle').bind('click',function() {
		if(toggle_off) {
			$('#advanced-guides').slideDown('fast', function() {
			   	$('.toggle').children('.knob').css('-webkit-transform','translateX(2.4em)');
				$('.toggle').children('.on-off').css('margin-left','-1.5em').html('ON');
			});
			toggle_off = false;
		}
		else {
			$('#advanced-guides').slideUp('fast',  function() {
				$('.toggle').children('.knob').css('-webkit-transform','translateX(0)');
				$('.toggle').children('.on-off').css('margin-left','0').html('OFF');
			});
			toggle_off = true;
		}
	});
	
	/**********************************************************

				MENU VIEW - DROPDOWN FUNCTIONALITY

	**********************************************************/

	var this_button = '';
	$('.menu-btn').bind('click',function() {
		$('#menu-controls li').removeClass('menu-item-highlighted');
		$(this).addClass('menu-item-highlighted ');
		var btn_from_left = $(this).offset().left;
		$('#menu-dropdown').css({'left': btn_from_left+'px','opacity':'1'}).show();
		$('.dropdown-group').hide();
		
		var this_val = $(this).children('span').html().toLowerCase();
		$('.'+this_val).show();
		if($(this).children('span').html() == this_button) {
			$(this).removeClass('menu-item-highlighted ');
			hideDropdown();	
			this_button = '';		
		}
		else {
			this_button = $(this).children('span').html();
		}
		
		if($('#active-guides-count').html() == '0') {
			$('.hide-guide-button, .remove-guides-button').addClass('inactive-link');
		}
		else {
			$('.hide-guide-button, .remove-guides-button').removeClass('inactive-link');
		}
	});
	
	/**********************************************************

				TOGGLE VIEWS (MENU BAR / FLOATING PANEL)

	**********************************************************/
	
	$('#floating-panel').bind('click', function() {
		$('#guides-js').hide();
		$('#panel-menu').show();
		$('#menu-controls li').removeClass('menu-item-highlighted');
		hideDropdown();
		$('.draggable').each(function() {
			var cv = $(this).css('top');
			$(this).css('top',parseInt(cv)-40);
		});
		this_button = '';	
	});
	
	$('#panel-menu .header').bind('click', function() {
		$('#guides-js').show();
		$('#panel-menu').hide();
		$('.draggable').each(function() {
			var cv = $(this).css('top');
			$(this).css('top',parseInt(cv)+40);
		});
	});
	
	
	
	
	/**********************************************************

							RULERS

	**********************************************************/	
	
	var browser_width = parseInt($(window).width()) - 16;
	var browser_height = $(document).height();

	for(x=0;x<=browser_width;x+=5) {
	  if(x % 5 == 0) {
	    if(x % 100 == 0) {
	      $('#x-ruler').append('<span class="lrg"></span>');
	      $('#x-ruler').append('<span class="value">'+x+'</span>');
	    }
	    else if(x % 50 == 0) {
	      $('#x-ruler').append('<span class="med"></span>');
	    }
	    else if(x % 25 == 0) {
	      $('#x-ruler').append('<span class="sml"></span>');
	    }
	    else {
	      $('#x-ruler').append('<span class="tick"></span>');
	    } 
	  }
	}

	for(y=0;y<=browser_height;y+=5) {
	  if(y % 5 == 0) {
	    if(y % 100 == 0) {
	      $('#y-ruler').append('<span class="lrg"></span>');
	      $('#y-ruler').append('<span class="value">'+y+'</span>');
	    }
	    else if(y % 50 == 0) {
	      $('#y-ruler').append('<span class="med"></span>');
	    }
	    else if(y % 25 == 0) {
	      $('#y-ruler').append('<span class="sml"></span>');
	    }
	    else {
	      $('#y-ruler').append('<span class="tick"></span>');
	    } 
	  }
	}
	
	var body_font_size = parseInt($('body').css('font-size'));
	var rulers_shown = false;
	$('#pixel-ruler').bind('click', function() {
		if(!rulers_shown) {
			$(this).addClass('checked');
			$('#wrapper').addClass('wrapper-adjustment');
			$('#x-ruler, #y-ruler').removeClass('hidden-element');
			$('.draggable').each(function() {
				var cv = $(this).css('top');
				$(this).css('top',parseInt(cv)+body_font_size);
			});
			rulers_shown = true;
		}
		else {
			$(this).removeClass('checked');
			$('#wrapper').removeClass('wrapper-adjustment');
			$('#x-ruler, #y-ruler').addClass('hidden-element');
			$('.draggable').each(function() {
				var cv = $(this).css('top');
				$(this).css('top',parseInt(cv)-body_font_size);
			});
			rulers_shown = false;
		}
	});
	
});