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
        if (lastMousewheelTime === 0) {
            lastMousewheelTime = Math.round(e.timeStamp);
            if (e.originalEvent.wheelDelta > 0) {
                snapToPage('up');
            } else {
                snapToPage('down');
            }
        } else {
            var thisTime = Math.round(e.timeStamp);
            if (thisTime > lastMousewheelTime + 1500) {
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
            $('.page-background-container').addClass('scale-down');
            var lastPageBackground = $('.page[data-page-number="' + lastPageNumber + '"] .page-background');
            setTimeout(function() {
                lastPageBackground.addClass('hide-up');
            }, 750);
            var scrollTo = $('.page[data-page-number="' + pageNumber + '"]')[0].offsetTop;
            $('.fullscreen').animate({
                scrollTop: scrollTo
            }, 1500);
        }
    }
});