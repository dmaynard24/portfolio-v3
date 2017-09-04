$(function() {
    var pageNumber = 1;
    var pageCount = $('.page').length;

    function init() {
        $('.fade-in-down').each(function() {
            $(this).addClass('active');
        });
    }

    init();

    var lastMousewheelTime = 0;
    $(window).bind('mousewheel', function(e) {
        if (lastMousewheelTime === 0) { // first scroll
            if (e.originalEvent.wheelDelta > 0) {
                snapToPage('up');
            } else {
                lastMousewheelTime = Math.round(e.timeStamp);
                snapToPage('down');
            }
        } else {
            var thisTime = Math.round(e.timeStamp);
            if (thisTime > lastMousewheelTime + 2250) {
                lastMousewheelTime = thisTime;
                if (e.originalEvent.wheelDelta > 0) {
                    snapToPage('up');
                } else {
                    snapToPage('down');
                }
            }
        }
    });

    var touchDown;
    var touchDownTime;
    $(window).bind('touchstart', function(e) {
        touchDown = e.originalEvent.touches[0].clientY;
        touchDownTime = Math.round(e.timeStamp);
    });

    $(window).bind('touchend', function(e) {
        var touchUp = e.originalEvent.changedTouches[0].clientY;
        var touchUpTime = Math.round(e.timeStamp);
        if (touchUpTime - touchDownTime > 1000) { // hesitated touchmove
            if (touchUp > touchDown + 30) {
                snapToPage('up');
            } else if (touchUp < touchDown - 30) {
                snapToPage('down');
            }
        } else { // instant touchmove
            if (touchUp > touchDown + 15) {
                snapToPage('up');
            } else if (touchUp < touchDown - 15) {
                snapToPage('down');
            }
        }
    });

    function snapToPage(direction) {
        var cancel = false;
        var lastPageNumber = pageNumber;

        if (direction == 'up') {
            if (pageNumber !== 1) {
                pageNumber--;
            } else {
                cancel = true;
            }
        } else if (direction == 'down') {
            if (pageNumber !== pageCount) {
                pageNumber++;
            } else {
                cancel = true;
            }
        }
        
        if (!cancel) {
            // reset
            $('.below').removeClass('below');
            $('.above').removeClass('above');
            $('.slide-in').removeClass('slide-in');
            $('.hide-up').removeClass('hide-up');
            $('.hide-down').removeClass('hide-down');

            var lastPageBackgroundContainer = $('.page[data-page-number="' + lastPageNumber + '"] .page-background-container');
            var lastPageBackground = $('.page[data-page-number="' + lastPageNumber + '"] .page-background');
            var page = $('.page[data-page-number="' + pageNumber + '"]');
            var pageBackgroundContainer = $('.page[data-page-number="' + pageNumber + '"] .page-background-container');
            var pageBackground = $('.page[data-page-number="' + pageNumber + '"] .page-background');

            // set position
            if (direction == 'up') {
                pageBackground.addClass('above');
            } else {
                pageBackground.addClass('below');
            }

            // first animations
            $('.page-background-container').addClass('scale-down');
            var scrollTo = page[0].offsetTop;
            $('.fullscreen').animate({
                scrollTop: scrollTo
            }, 1500, function() {
                $('.page-background-container').removeClass('scale-down');
            });

            // second animations
            setTimeout(function() {
                if (direction == 'up') {
                    lastPageBackground.addClass('hide-down');
                } else {
                    lastPageBackground.addClass('hide-up');
                }

                $('.highest-z').removeClass('highest-z');
                pageBackgroundContainer.addClass('highest-z');
                pageBackground.addClass('slide-in');
            }, 750);
        }
    }
});