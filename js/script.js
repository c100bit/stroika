/*

 myMap.geoObjects.events.add('click', function(e) {
            var targetObject = e.get('target');
            var objectId = e.get('objectId'); 
            console.log(targetObject.geometry.getType());
            if (targetObject.geometry.getType() === 'Point') {
                myMap.setCenter(targetObject.geometry.getCoordinates(), 16, {
                    checkZoomRange: true,
                    duration: 200
                }).then(function() {
                    objectManager.objects.balloon.open(targetObject);
                });
            }
        });
        myMap.events.add('balloonclose', function (event) {
            myMap.setZoom(13, {
                duration: 200
            });
        });
        */

$(document).ready(function() {
    var height = $(document).height();
    var header_height;
    var tabs_height;
    $('.card').each(function(index, el) {

        setTimeout(function () {
            $(el).addClass('animated bounceInLeft');
            $(el).css('display', 'flex');  
        }, index*100);
        
    });
    ymaps.ready(init);
    var myMap;
    var placemark_designed;
    var placemark_documentation;
    var placemark_construction;
    var placemark_ready;
    function init(){     
        myMap = new ymaps.Map("map", {
            center: [67.650876, 53.043470],
            zoom: 13,
            type: 'yandex#map',
            controls: []
        });
        
        myMap.controls.add('zoomControl', {
            position: {
                right: 20,
                top: (height / 2 ) - (28 * 2 + 150) / 2
            }
        });

        placemark_designed = new ymaps.GeoObjectCollection(null, {});
        placemark_documentation = new ymaps.GeoObjectCollection(null, {});
        placemark_construction = new ymaps.GeoObjectCollection(null, {});
        placemark_ready = new ymaps.GeoObjectCollection(null, {});
        $('.card').each(function(index) {
            var coordsString = $(this).find('.coords').text();
            var coords = coordsString.split(", ");
            var X = coords[0];
            var Y = coords[1];
            var title = $(this).find('.card-text').find('h2').text();
            var address = $(this).find('.card-text').find('p').text();
            var status = $(this).find('.status-icon').attr('class').split(" ")[1];
            var year = $(this).find('.year').children('span').eq(1).text();
            var status_text = $(this).find('.status').children('span').eq(1).text();
            var presetStyle;
            if (status == "designed") {presetStyle = "islands#greyStretchyIcon"}
            if (status == "documentation") {presetStyle = "islands#blueStretchyIcon"}
            if (status == "construction") {presetStyle = "islands#orangeStretchyIcon"}
            if (status == "ready") {presetStyle = "islands#darkgreenStretchyIcon"}
            var placemark = new ymaps.Placemark([X, Y], {
                hintContent: "<strong>"+title+"</strong>", 
                balloonContent: "<div class='placemark-map'>"+
                                "<h3 style='margin: 0;'>"+title+"</h3>"+
                                "<p>"+address+"</p>"+
                                "<p>Срок ввода: "+year+"</p>"+
                                "<p>Статус: "+status_text+"</p>"+
                                "<p><a class='href-id open-obj'>Перейти к объекту</a></p>"+
                                "<span class='id'>"+index+"</span>"+
                                "</div>"
            }, {
                preset: presetStyle
            });
            
            if (status == "designed") {placemark_designed.add(placemark)}
            if (status == "documentation") {placemark_documentation.add(placemark)}
            if (status == "construction") {placemark_construction.add(placemark)}
            if (status == "ready") {placemark_ready.add(placemark)}
        });
        
        myMap.geoObjects.add(placemark_designed);
        myMap.geoObjects.add(placemark_documentation);
        myMap.geoObjects.add(placemark_construction);
        myMap.geoObjects.add(placemark_ready);
    }

    $("#wrapper").on("click", ".open-obj", function(){
        myMap.geoObjects.removeAll();
        var curr_index;
        var curr_placemark;
        var newX;
        var newY;
        if ($(this).hasClass('href-id')) {
            curr_index = $(this).closest('.placemark-map').find('.id').text();
        }
        if ($(this).hasClass('card')) {
            curr_index = $('.card').index(this);
        }
        $('#side').css('overflow', 'hidden')
                  .css('width', '595px');
        $('.card').each(function(index, el) {
            $(el).removeClass('animated bounceInLeft');
            $(el).addClass('animated bounceOutLeft');
            $('.card-filter').removeClass('animated bounceInLeft');
            $('.card-filter').addClass('animated bounceOutLeft');
            if(index == curr_index) { 
                $(el).addClass('opened-card');
                var first_tab = $(el).find('.tab_link')[0];
                $(first_tab).addClass('active_tab');
                var coordsString = $(el).find('.coords').text();
                var coords = coordsString.split(", ");
                newX = coords[0];
                newY = coords[1];
                var status = $(this).find('.status-icon').attr('class').split(" ")[1];
                var presetStyle;
                if (status == "designed") {presetStyle = "islands#greyStretchyIcon"}
                if (status == "documentation") {presetStyle = "islands#blueStretchyIcon"}
                if (status == "construction") {presetStyle = "islands#orangeStretchyIcon"}
                if (status == "ready") {presetStyle = "islands#darkgreenStretchyIcon"}
                curr_placemark = new ymaps.Placemark([newX, newY], {}, {preset: presetStyle});
            }
            setTimeout(function () {
                $('.card-filter').css('display', 'none');
                $(el).css('display', 'none');
                if(index == curr_index) {
                    $(el).find('.card-img').find('img').css('height', 'auto')
                                                       .css('width', '100%');
                    $('#side').css('width', '1000px');
                    $(el).removeClass('open-obj animated bounceOutLeft');
                    $(el).addClass('animated bounceInLeft');
                    $(el).find('.open-card').css('display', 'flex');
                    $(el).css('height', height - 20)
                         .css('display', 'flex')
                         .css('cursor', 'auto');
                    var tab_width = $(el).find('.active_tab').width();
                    $(el).find('.active_line').css('right', tab_width * 4);
                    var card_content_block = $(el).find('.card-content-block')[0];
                    $(card_content_block).addClass('show');
                    header_height = $(el).find('.card-header').height();
                    tabs_height = $(el).find('.tabs').height();
                    $(el).find('.open-card-content').height(height - 90 - header_height - tabs_height);
                }
                myMap.geoObjects.add(curr_placemark);
                myMap.setCenter([newX, newY], 16, {
                    checkZoomRange: true,
                    duration: 400
                });
            }, 500);
                
        });
        
        $('#map').animate({
            left: "1000px"
        }, 400, function() {
            $('.logo').css('left', '1020px');
            setTimeout(function () {
                myMap.container.fitToViewport();
            }, 100);
        });
    });
    $("#wrapper").on("click", ".tab_link", function(){
        if(!$(this).hasClass('active_tab')) {
            var tabs = $(this).closest('.tabs');
            var tab_links = $(tabs).find('.tab_link');
            $(tab_links).addClass('select_tabs');
            var active_index = $(tabs).find('.active_tab').index('.select_tabs');
            var select_index = $(tabs).find('.tab_link').index(this);
            var line = $(tabs).find('.active_line');
            tabs.find('.tab_link').removeClass('active_tab');
            $(this).addClass('active_tab');
            var width = $(this).closest('.tabs').width();
            var tab_width = $(this).width();
            line.animate({
                right: width - tab_width * (select_index + 1),
                left: tab_width * select_index
            }, 300);
            var content = $(this).closest('.open-card').find('.open-card-content');

            var active_box = $(content).find('.card-content-block')[active_index];
            var select_box = $(content).find('.card-content-block')[select_index];
            $(active_box).stop();
            $(select_box).stop();
            console.log(active_index);
            console.log(select_index);
            var slide_to;
            if (active_index < select_index) {
                $(select_box).addClass('from-right');
                slide_to = -1100;
            } else {
                $(select_box).addClass('from-left');
                slide_to = 1100;
            }
            $(select_box).addClass('show');
            $(active_box).css('position', 'absolute');
            $(active_box).animate({
                left: slide_to,
                right: -slide_to-tab_width
            }, 300);
            $(select_box).animate({
                left: 0,
                right: 0
            }, 350, function() {

                $('.card-content-block').removeClass('show');
                $(active_box).removeClass('show');
                $(select_box).removeClass('from-left');
                $(select_box).removeClass('from-right');
                $(select_box).css('position', 'static');
                $(select_box).addClass('show');
                $('.card-content-block').attr('style', '');
            });


            
            
        }
    });
    $("#wrapper").on("click", ".close-btn", function(){
        $(this).closest('.card').removeClass('animated bounceInLeft');
        $(this).closest('.card').addClass('animated bounceOutLeft');
        setTimeout(function() {
            $('.card-filter').removeClass('bounceOutLeft animated');
            $('.card-filter').attr('style', '');
            $('.card-filter').addClass('animated bounceInLeft');
            $('.card-img').find('img').attr('style', '');
            $('#side').attr('style', '');
            $('.open-card').css('display', 'none');
            $('.card').removeClass('open-obj animated bounceOutLeft');
            $('.tab_link').removeClass('select_tabs');
            $('.tab_link').removeClass('active_tab');
            $('.active_line').attr('style', '');
            $('.card-content-block').attr('style', '');
            $('.card-content-block').removeClass('show');
            $('.card').removeClass('opened-card');
            var status;
            if($('.status-btn-span').is('.active')) {
                if($('.status-btn-span.active').hasClass('designed')) {status = 'designed';}
                if($('.status-btn-span.active').hasClass('documentation')) {status = 'documentation';}
                if($('.status-btn-span.active').hasClass('construction')) {status = 'construction';}
                if($('.status-btn-span.active').hasClass('ready')) {status = 'ready';}
                $('.card').each(function() {
                    var status_span = $(this).find('.status').find('.right');
                    if ($(status_span).hasClass(status)) {
                        $(this).addClass('animated bounceInLeft');
                        $(this).attr('style', 'display: flex;');
                    }
                });
            } else {
                status = 'none'
                $('.card').addClass('animated bounceInLeft');
                $('.card').attr('style', 'display: flex;');
            }
            $('#map').animate({
                left: 600
            }, 400, function() {
                $('.logo').css('left', '600px');
                myMap.geoObjects.removeAll();
                if (status == 'none') {
                    myMap.geoObjects.add(placemark_designed);
                    myMap.geoObjects.add(placemark_documentation);
                    myMap.geoObjects.add(placemark_construction);
                    myMap.geoObjects.add(placemark_ready);
                }
                if (status == 'designed') {myMap.geoObjects.add(placemark_designed);}
                if (status == 'documentation') {myMap.geoObjects.add(placemark_documentation);}
                if (status == 'construction') {myMap.geoObjects.add(placemark_construction);}
                if (status == 'ready') {myMap.geoObjects.add(placemark_ready);}
                setTimeout(function () {
                    myMap.container.fitToViewport();
                    myMap.setZoom(13, {
                        duration: 400
                    });
                }, 200);
            });
            $('.card').addClass('open-obj');
        }, 400);
        
    });
    $("#wrapper").on("click", ".zakupki-obj", function(){
        $(this).find('.arrow-btn').toggleClass('fa-angle-down');
        $(this).find('.arrow-btn').toggleClass('fa-angle-up');
        $(this).next().find('.zakupki-history').slideToggle();
    });
    $("#wrapper").on("click", ".status-btn-span", function(){
        myMap.geoObjects.removeAll();
        if($(this).hasClass('active')) {
            myMap.geoObjects.add(placemark_designed);
            myMap.geoObjects.add(placemark_documentation);
            myMap.geoObjects.add(placemark_construction);
            myMap.geoObjects.add(placemark_ready);
            $(this).removeClass('active');
            $('.card').removeClass('animated bounceInLeft bounceOutLeft');
            $('.card').addClass('animated bounceOutLeft');
            setTimeout(function() {
                $('.card').css('display', 'flex');
                $('.card').removeClass('animated bounceOutLeft');
                $('.card').addClass('animated bounceInLeft');
            }, 300);
        } else {
            $('.status-btn-span').removeClass('active');
            $(this).addClass('active');
            var status;
            if($(this).hasClass('designed')) {
                status = 'designed';
                myMap.geoObjects.add(placemark_designed);
            }
            if($(this).hasClass('documentation')) {
                status = 'documentation';
                myMap.geoObjects.add(placemark_documentation);
            }
            if($(this).hasClass('construction')) {
                status = 'construction';
                myMap.geoObjects.add(placemark_construction);
            }
            if($(this).hasClass('ready')) {
                status = 'ready';
                myMap.geoObjects.add(placemark_ready);
            }
            $('.card').removeClass('animated bounceInLeft');
            $('.card').addClass('animated bounceOutLeft');
            setTimeout(function() {
                $('.card').attr('style', '');
                $('.card').each(function(index, el) {
                    var status_span = $(el).find('.status').find('.right');
                    if ($(status_span).hasClass(status)) {
                        $(el).removeClass('animated bounceOutLeft')
                        $(el).addClass('animated bounceInLeft');
                        $(el).css('display', 'flex');
                    }
                });
            }, 300);
        }
    });
    stopPreload();
    $( window ).resize(function() {
        var height = $(document).height();
        $('.opened-card').height(height - 20);
        $('.opened-card').find('.open-card-content').height(height - 90 - header_height - tabs_height);
    });
});

var startPreload = function() {
    $('.preloader-wrapper').fadeIn('fast');
}
var stopPreload = function() {
    $('.preloader-wrapper').fadeOut('fast');
    
}

var animationEnd = (function(el) {
  var animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'mozAnimationEnd',
    WebkitAnimation: 'webkitAnimationEnd',
  };

  for (var t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
})(document.createElement('div'));