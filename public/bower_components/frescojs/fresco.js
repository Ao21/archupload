/*	ChillBox - Version 1.3.1 - jQuery Plug-in
	by Christopher Hill - http://www.chillwebdesigns.co.uk/
	Last Modification: 04.04.2012
	
	For more information, visit: http://www.chillwebdesigns.co.uk/chillbox.html
	
	Licensed under the Creative Commons Attribution 3.0 Unported License - http://creativecommons.org/licenses/by/3.0/
	- Free for use in both personal and commercial projects
	- Attribution requires leaving author name, author link, and the license info intact 
*/
(function($){

		// ChillBox Function
		$.fn.ChillBox = function (options){
			
			var defaults = { 
			
				// Settings for modification.													.
				OLO  :		  '75', // Overlay opacity in (%).
				OLC  :	 '#000000', // Background overlay colour using (hex colour codes).
				LTC	 :	 '#FFFFFF', // Loading text colour using (hex colour codes).
				CBBC :	 '#000000', // ChillBox background colour using (hex colour codes).	
	 			CBTC :	 '#FFFFFF', // ChillBox title colour, uses (hex) colour code.
				BCCB :	 '#000000',	// ChillBox border and image border colour using (hex colour codes).
				BC   :	 '#000000', // ChillBox button text colour using (hex colour codes).
				BTC	 :	 '#FFFFFF', // ChillBox button text colour using (hex colour codes).
				BBCH :	 '#007EFF', // ChillBox button text colour on hover using (hex colour codes).
				BTS	 :		  '11', // ChillBox button text size in (px).
				CBTS :		  '12', // ChillBox title text size in (px).
				LTS	 :		  '12', // Loading text size in (px).
				LT	 :'Loading...', // Loading text value.
				FIOL :		   250, // Overlay fade in time (milliseconds).
				CBFI :		   400, // ChillBox fade in time time (milliseconds).
				CBFO :         400, // ChillBox and Overlay fade out time time (milliseconds).
	 			CLSB :		   'X', // ChillBox close button text value.
				PREV :	 '&#9668;', // ChillBox previous button text value.
				NEXT :   '&#9658;', // ChillBox next button text value.	
	 			EKBB :		'true', // Enable keyboard buttons, (N / >) - Next, (P / <) - Prev, (ESC / C / X) - Close.			
				CBCC :     'false', // Close ChillBox by clicking the ChillBox image.
				OLCC :      'true', // Close ChillBox by clicking the overlay.
				LOOP :     'false', // Enable ChillBox next / prvious image loop.
				ECBC :		'true', // Show ChillBoxGroup image counter.
				ST	 :		'true', // Show ChillBox titles.
				SHAD :		'true'	// Show ChillBx shadow.
			
			}; 
			var cb = $.extend(defaults, options);
				
	this.each(function(){
	
	// Shorthand document & window.
	var doc = $(document), win = $(window);		
		
	// If rel="ChillBox" or rel="ChillBoxGroup" then apply the following function.	
	$(this).click(function(){
			
					// Get this rel value.
			var 	rel = $(this).attr('rel'),
			
					// Get how many of this rels there are on the page.
					relSize = $('[rel='+rel+']').size(),
			
					// Get the current position in terms of the rel clicked.
					index = $('[rel='+rel+']').index(this);
			
					// Index this position.
					$(this).attr({'ChillBox-position':index});
			
					// Get the link of clicked.
			var 	hf = $(this).attr("href");
			
			if($().jquery <= "1.6.0" ){
			
					// Get the title of clicked.
			var 	attr = $(this).attr("title"),
					
					tit = $(this).attr("title");
			}
			
			else{
				
					// Get the title of clicked.
			var 	attr = $(this).prop("title"),
					
					tit = $(this).prop("title");
			}
			
			// For some browsers, `attr` is undefined; for others, 
			if (attr == 'undefined' || attr == false) {tit = "&nbsp;";} 			
	
			// Append Overlay Div to the body.
			$('<div class="ChillBox"><img src="'+ hf +'" />' + 
			  '<div class="CBTIT"></div><div class="CBNAV"><a id="close">' + cb.CLSB + '</a></div></div>').appendTo('body');
			
			// Append Title Div to the ChillBox.
			if(cb.ST == "true"){$('<span>' + tit + '</span>').appendTo('.CBTIT');}
						
			// Append buttons and image counter is this rel="ChillBoxGroup" is greater than one.					
			if((rel.match("Group") || rel.match("group")) && relSize > 1){
				
				$('<a id="next">' + cb.NEXT +'</a><a id="prev">' + cb.PREV + '</a>').appendTo('.CBNAV');
			
				// Append conter if enabled.
				if(cb.ECBC == "true"){
					
					$('<span id="count">' +  parseInt(index + 1 , 10) + ' /   ' + relSize + '</span>').appendTo('.CBNAV');}
			
			}
			
			// If ChillBox Image clicked it clicks the close button.
			if(cb.CBCC == 'true'){$('.ChillBox img').click(function(){$('#close').click();});}			
			
			$('[rel^='+rel+']').filter('.selected').removeClass('selected');
      		
			$(this).addClass('selected');	
			
			var current = parseInt($('[rel^='+rel+']').filter('.selected').attr('ChillBox-position'),10);
	
			// If loop is true hide the next button if last image displayed and hide prev button if first.
			if(cb.LOOP == "false"){
			
				if($('[rel='+rel+']').last().hasClass('selected')){$('#next').remove();}
				if($('[rel='+rel+']').first().hasClass('selected')){$('#prev').remove();}
			
			}	
			
			// Enable keyboard function for group navigation.
			if(cb.EKBB =="true"){
				
				// If the left key or p key is pressed ChillBox gets the previous image.
				doc.keydown(function(e){if (e.keyCode == 37 || e.keyCode == 80){setTimeout(function(){$('#prev').click();},250);}});
				
				// If the right key or n is pressed ChillBox gets the next images.
				doc.keydown(function(e){if (e.keyCode == 39 || e.keyCode == 78){setTimeout(function(){$('#next').click();},250);}});
			
			}
			// If the previous button is pressed then run the following function to get the previous image.
			
			// If the previous button is pressed then run the following function to get the previous image.
			$('#prev').click(function(){
					
				$('.ChillBox,#shadow').remove();
			
				setTimeout(function(){
					
				var to = $('[rel='+rel+']').eq(current - 1);
					   
				if(!to.size()){to = $('[rel='+rel+']').eq(0);}
						
				if(to.size()){to.click();}
					
				},400);
					
				return false;
				
			});	
			
			// If the next button is pressed then run the following function to get the next image.
			$('#next').click(function(){									  
									  
				$('.ChillBox,#shadow').remove();
				
				setTimeout(function(){
				
				var too = $('[rel='+rel+']').eq(current + 1);
					   
				if(!too.size()){too =  $('[rel='+rel+']').eq(0);}
						
				if(too.size()){too.click();}
						
				},400);
					
				return false;
				
			});
			// Start ChillBox function.
			ChillBox();		
			
			// Prevents the image or link being opened in the window.
			return false;
		
		});
	
// ChillBox Function		
function ChillBox(){
	
			// If overlay is visible already do nothing, if not fade in loading and overlay divs.
			if($('.Ov').is(':visible')){var OLV = "true";}
			
			// Disable right click when ChillBox is enabled.
			$('.Ov,.ChillBox,.Loading').bind("contextmenu",function(e){return false;});
			
			if(OLV != "true" || OLV == null ){Overlay();Loading();}
			
			// Onload set opacity for chillbox div to 0.
			$(".ChillBox").css({
							opacity:'0',
							width:'0', 
							bottom:'0', 
							top:'0', 
							right:'0',
							left:'0',
							lineHeight:'1.35',
							verticalAlign:'baseline',
							height:'0',
							zIndex:'1003',
							border:'2px solid',
							borderColor:cb.BCCB,
							fontFamily:'Arial',
							backgroundColor:cb.CBBC
							
							});	
			// Once img is appended to chillbox div get image width and height.
			
			$(".ChillBox img").load(function() {
			
			var imgHeight1;
			
			// This version of jQuery is greater than or equal too version 1.4.3 the use these variables.
			if($().jquery >= "1.4.3" ){
				
				// This works with prototype installed
				imgHeight1 = $(".ChillBox img").height();
			
			}
			
			// If not then use these variables.
			else{

				// This works with prototype installed
				imgHeight1 = jQuery.css(jQuery('.ChillBox img')[0], 'height'); // If just jQuery is installed then you could use $('.CB img').height();
			
			}	

				
		  		var WinH = win.height(), WinW = win.width(), Padding = ((WinH + WinW)/2) * 0.25;
					
			
				if(WinH < imgHeight1){
					
				$(this).css({height: WinH - Padding, margin:Padding / 2});
				
				}
			
			var imgWidth1;
			
			// This version of jQuery is greater than or equal too version 1.4.3 the use these variables.
			if($().jquery >= "1.4.3" ){
				
				// This works with prototype installed
				imgWidth1  = $('.ChillBox img').width();

			
			}
			
			// If not then use these variables.
			else{
				
				// This works with prototype installed
				imgWidth1  = jQuery.css(jQuery('.ChillBox img')[0], 'width'); // If just jQuery is installed then you could use $('.CB img').width();
			
			}	
				
				var	NewW	= imgWidth1;
					
				if(WinW < NewW){
					
				$(this).css({width: WinW - Padding, margin:Padding / 2});
				
				}	
				   
				var imgWidth;
				var imgHeight;
			
			// This version of jQuery is greater than or equal too version 1.4.3 the use these variables.
			if($().jquery >= "1.4.3" ){
				
				// This works with prototype installed
				imgWidth  = $('.ChillBox img').width();
				
				// This works with prototype installed
				imgHeight = $('.ChillBox img').height();
			
			}
			
			// If not then use these variables.
			else{
				
				// This works with prototype installed
				imgWidth  = jQuery.css(jQuery('.ChillBox img')[0], 'width'); // If just jQuery is installed then you could use $('.CB img').width();
				
				// This works with prototype installed
				imgHeight = jQuery.css(jQuery('.ChillBox img')[0], 'height'); // If just jQuery is installed then you could use $('.CB img').height();
			
			}

			$(".CBTIT").css({
							width:imgWidth-152, 
							margin:'0 11px 11px 11px',
							"float":'left',
							textAlign:'justify',
							opacity:'0',
							padding:'3px 0',
							fontSize:cb.CBTS+"px",
							display:'block',
							backgroundColor:cb.CBBC,	// Needed to remove fade in glitch of Text in IE 6
							color:cb.CBTC
							});
			$(".CBTIT span").css({
							margin:'0'
							});
			$(".CBNAV").css({
							width:'130px',
							margin:'0 11px 11px 11px',
							"float":'right',
							opacity:'0',
							backgroundColor:cb.CBBC		// Needed to remove fade in glitch of Text in IE 6
							});
			$(".CBNAV a").css({
							"float":'right'							
							});				
			// ChillBox close link styles.
			$(".CBNAV a#close").css({	
							margin:'0 0 0 8px', 
							padding:'2px 6px'
							});			
			// ChillBox close link styles.
			$(".CBNAV span").css({	
							padding:'3px 0',
							marginRight:'8px',
							color:cb.CBTC,
							fontSize:cb.CBTS+"px",
							"float":'right'
							});			
			// ChillBox close link styles.
			$(".CBNAV a#close,.CBNAV a#next,.CBNAV a#prev").css({	
							backgroundColor:cb.BC,
							cursor:'pointer',
							color:cb.BTC,
							fontSize:cb.BTS+"px",
							border:'2px solid',
							borderColor:cb.BCCB,
							"float":'right',
							textDecoration:'none' 
							});			
			// ChillBox close link styles.
			$(".CBNAV a#next,.CBNAV a#prev").css({	
							margin:'0px 2px 0px 2px', 
							padding:'2px 4px'
							});			
			// ChillBox image styles.
			$(".ChillBox img").css({
							opacity:'0',
							margin:'11px',
							border:'2px solid',
							borderColor:cb.BCCB,
							padding:'0'
							});	
			
			var titHeight;
			
			// This version of jQuery is greater than or equal too version 1.4.3 the use these variables.
			if($().jquery >= "1.4.3" ){
				
				// This works with prototype installed
				titHeight = $('.CBTIT span').height();
	
			}
			
			// If not then use these variables.
			else{
				
				// This works with prototype installed
				titHeight = jQuery.css(jQuery('.CBTIT span')[0], 'height'); // If just jQuery is installed then you could use $('.ChillBox img').height();
				
			}			
			
			// 	Chillbox styles for IE6 and below.
			if($.browser.msie && $.browser.version <= 6 || navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod'){

			$(".CBTIT").css({margin:'0 11px 11px 6px'});
			$(".CBNAV").css({margin:'0 6px 11px 11px'});
			$(".CBNAV span").css({padding:'4px 0'});

			// Move chillbox to the center of the screen when scrolled in IE6 because fixed position is not supported.
			win.scroll(function(){$(".ChillBox,#shadow").css({top:win.scrollTop() + win.height()/2 + "px"});}); 
			
			if(cb.SHAD == 'true' && $.browser.msie && $.browser.version <= 6 ){
			$('<div id="shadow"></div>').appendTo('body');
			
			$('#shadow').css({display:'none',
							 backgroundColor:'#000',
							 margin:'5px 0 0 0',
							 zIndex:'1001',
							 filter:'progid:DXImageTransform.Microsoft.Blur(pixelradius=9)',
							 MsFilter:'progid:DXImageTransform.Microsoft.Blur(pixelradius=9)',
							 position:'absolute',
							 top:win.scrollTop() + win.height()/2  + "px",							
							 left:'49.5%',
							 marginTop:-((imgHeight+titHeight+68)/2),
							 marginLeft:-((imgWidth+46)/2), 							  
							 width:(imgWidth+30), 
							 height:(imgHeight+titHeight+50)							 
							 });
			}
			
		
			// Chillbox styles for IE6 and below and restore cleartype to text after fade in.
			$(".ChillBox").css({							
							position:'absolute',
							left:'49.5%',
							top:win.scrollTop() + win.height()/2  + "px",
							height:(imgHeight+1)-imgHeight
							}).animate({opacity:"1",marginLeft:-((imgWidth+26)/2),marginTop:-((imgHeight+39+titHeight+3)/2), width:(imgWidth+30), height:(imgHeight+39+titHeight+6)}, cb.CBFI, function(){$(".ChillBox img,.CBTIT,.CBNAV").fadeTo(cb.CBFI, '1',function(){
			if($.browser.msie){this.style.removeAttribute("filter");}});$('#shadow').show(1);});
			
			}
			
			else{
			
			if(cb.SHAD == 'true' && navigator.platform != 'iPad' || navigator.platform != 'iPhone' || navigator.platform != 'iPod'){
				
			// Shadow Effect IE
			$('<div id="shadow"></div>').hide().appendTo('body');
			
			$('#shadow').css({
							 backgroundColor:'#000',
							 margin:'0',
							 zIndex:'1001',
							 filter:'progid:DXImageTransform.Microsoft.Blur(pixelradius=8)',
							 MsFilter:'progid:DXImageTransform.Microsoft.Blur(pixelradius=8)',
							 position:'fixed',
							 top:win.height()/2,
							 left:'49.5%',
							 marginTop:-((imgHeight+titHeight+66)/2),
							 marginLeft:-((imgWidth+46)/2), 							  
							 width:(imgWidth+34), 
							 height:(imgHeight+titHeight+54)							 
							 });
		

			// Shadow Effect
			$(".ChillBox").css({
							WebkitBoxShadow:'0 0 1em hsla(0, 0%, 0%, 1.0)', // Safari
							MozBoxShadow:'0 0 1em hsla(0, 0%, 0%, 1.0)',	// FireFox
							boxShadow:'0 0 1em hsla(0, 0%, 0%, 1.0) ',		// Google & Opera
							top:win.height()/2  +"px"
							});	
			}
			
			if(cb.SHAD != 'true'){
				
			$("div.ChillBox").css({
							WebkitBoxShadow:'none', // Safari
							MozBoxShadow:'none',	// FireFox
							boxShadow:'none'		// Google & Opera							
							});	
			$("div#shadow").remove();
			
			}
			// Chillbox styles 
			$(".ChillBox").css({							
							top:win.height()/2,
							position:'fixed',
							left:'49.5%'
							}).animate({opacity:"1",marginLeft:-((imgWidth+26)/2),marginTop:-((imgHeight+39+titHeight+3)/2), width:(imgWidth+26), height:(imgHeight+39+titHeight+3)}, cb.CBFI, function(){
				
			
			// If Internet Explorer fade in shadow div.
			if($.browser.msie){$('#shadow').show(1);}	
			
			// Fade in ChillBox Content.
			$(".ChillBox img,.CBTIT,.CBNAV").fadeTo(cb.CBFI, '1', function(){
			if($.browser.msie){this.style.removeAttribute("filter");}	// Needed to restore cleartype to text after fade in.			
		
			});
			
			});
			
			}
		
			
			// On buttons hover change border color.
			$(".ChillBox a#next,.ChillBox a#prev,.ChillBox a#close").hover(function(){$(this).css({color:cb.BBCH});}, 
			
			// On mouse out return div border back to normal.
			function(){$(".ChillBox a#next,.ChillBox a#prev,.ChillBox a#close").css({color:cb.BTC});});		
			
			// Close button.
			$('#close').click(function(){
				
				$(".ChillBox img,.ChillBox span,.ChillBox a,.Loading,#shadow").remove();
				$('.Ov').fadeTo(cb.CBFO,'0',function(){$('.Ov,.ChillBox').remove();});
				// 	Chillbox styles for IE6 and below.
				if($.browser.msie && $.browser.version <= 6 || navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod'){		
				
				$(".ChillBox").animate({opacity:"0",left:'49.5%' ,top:win.scrollTop() + win.height()/2 + "px",
				marginLeft:(imgWidth/2), marginTop:(imgHeight/2)-15, width:-(imgWidth+26), height:-(imgHeight+52)}, cb.CBFO);
				
				}
				
				else{
				$(".ChillBox").animate({opacity:"0",left:'49.5%' ,top:$(window).height()/2  + "px",
				marginLeft:(imgWidth/2), marginTop:(imgHeight/2)-15, width:-(imgWidth+26), height:-(imgHeight+52)}, cb.CBFO);
				}
			});
			
			// If overlay clicked it clicks the close button.
			if(cb.OLCC == 'true'){$('.Ov').click(function(){$('#close').click();});$('.Ov').hover().css({cursor:'pointer'});}
			
			// If ChillBox Image clicked it clicks the close button.
			if(cb.CBCC == 'true'){$('.ChillBox img').click(function(){$('#close').click();});$('.ChillBox img').hover().css({cursor:'pointer'});}	
			
			// Enable keyboard function for close function.
			if(cb.EKBB == 'true'){
			
			
			if(cb.EKBB =="true"){		
						
			// Press X, x, ESC, c or C Key in IE6, IE8, Firefox, Opera fades out overlay
			doc.keypress(function(e){if (e.keyCode == 120 || e.keyCode == 99){$('#close').click();}});
								
			// Press X, x, ESC, c or C Key to fades out overlay
			doc.keydown(function(e){if (e.keyCode == 27 || e.keyCode == 88 || e.keyCode == 67){$('#close').click();}});
			}
			
			}
			
			});
					
// End of ChillBox function			
}			

// Overlay function
function Overlay(){
	
									
			// Disable right click when ChillBox is enabled.
			$('.Ov,.Loading,.ChillBox img').bind("contextmenu",function(e){return false;});
			
			// Get window height.
			var winHeight	= $('.ChillBox').height() - $(window).height();
			
			// Get window width.
			var winWidth 	=  $(window).width();
						
			// Get page height.
			var pageHeight 	=  $(document).height() - $('.ChillBox').height();	
			
			// Calculate the number of overlay divs required.
			var divNo 		= 	Math.round(pageHeight / 4096).toFixed(0);
			
			// Calculate the last div height.
			var divLast		=	(((pageHeight / 4096) - 1) * 4096);
			
			//alert(winHeight); alert(pageHeight); alert(divNo );
			
			// If document height is larger than the window height.
			if( pageHeight > 4096){

				// For the number of overlay divs add to body and style.
				for ( i = 0; divNo > i; i++){
					
				// Append overlay div to the body.
				$('<div class="Ov"></div>').hide().appendTo('body');
				
					// Overlay div styles.
					$('.Ov:eq(' + i + ')').css({
											backgroundColor:cb.OLC,
											bottom:'0',
											right:'0',
											top:i * 4096, 							 
											left:'0',
											margin:'0',
											padding:'0',
											outline:'0',
											border:'0',
											zoom:'1',
											width:winWidth,
											whiteSpace:'nowrap', 
											position:'absolute',
											zIndex:'1000',
											height:'4096px'
											});			
				}
				
					// Overlay Div Styles.
					$('.Ov:last').css({	height:divLast +'px'});
			
			} 
			
			
			
			else{
		
			
			
				// Append overlay div to the body.
				$('<div class="Ov"></div>').hide().appendTo('body');			
					
							// Overlay div styles.
							$('.Ov').css({
											backgroundColor:cb.OLC,
											bottom:'0',
											right:'0',
											top:'0', 							 
											left:'0',
											margin:'0',
											padding:'0',
											width:'100%',
											position:'absolute',
											zIndex:'1000',
											height:pageHeight
											});			
				
			}
			
			// On window resize re-run reposition overlay function.
			$(window).resize(function(){$('.Ov').css({width:$(window).width()});});
				
			// If overlay set to 0-9 make sure that the value is 0-9 and if not if you put 9 its read as 90.
			if(parseInt(cb.OLO, 10) <= '9' ){$('.Ov').fadeTo(cb.FIOL, "0.0" + cb.OLO);}
			
				else
					// If value is greater than or equal to 10 then apply opacity level as follows.
					if(cb.OLO >= '10' && cb.OLO != '100'){$('.Ov').fadeTo(cb.FIOL, "0." + cb.OLO);}
					
						else							
							// If value equals 100 then just fade in overlay with full color without opacity.
							if(cb.OLO == '100'){$('.Ov').fadeIn(cb.FIOL);}
						
						
		
// End of overlay function			
}

// Loading function
function Loading(){
			
			// Append Loading Div to the body and Add loading... text to loading div..
			$('<div class="Loading">'+cb.LT+'</div>').hide().appendTo('body');
			
			// Onload start reposition Loading Div.
			ReposLoad();
			
			// On window resize re-run function. 
			win.resize(function(){ReposLoad();});
			
			function ReposLoad(){
				
				
				var loadW	= win.width() * 0.505; // RESULT IS 49.5% OF WINDOW WIDTH
				
					// Loading Div Styles.
					$('.Loading').css({
							position:'fixed', 
							padding:'0',
							top:win.height()/2  + "px",
							fontFamily:'Arial',
							width:'100px', 
							bottom:'0', 
							right:'0',
							fontSize:cb.LTS+"px",
							textAlign:'center',
							left:loadW-50, 
							zIndex:'1002', 
							height:'0',
							color:cb.LTC
							});
					
					$('.Loading').show(0);	
					
					$(".ChillBox,#shadow").css({top:win.height()/2 + "px",left:win.width()/2 + "px"});
					
					// 	Chillbox styles for IE6 and below.
			if($.browser.msie && $.browser.version <= 6 || navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod'){

			$(".ChillBox,#shadow").css({top:win.scrollTop() + win.height()/2 + "px"});
			
			}
			}
			
			
// End of loading function			
}			
	
			});	
			
		// returns the jQuery object to allow for chainability.
		return this;
		};			

})(jQuery);