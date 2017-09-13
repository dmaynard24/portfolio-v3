$(function() {
    var loading = true,
        pageNumber = 1,
        sectionNumber = 1;

    function onInit() {
        $('.page-background-container').addClass('scale-down');
        $('.page-background-container').first().addClass('highest-z').addClass('loading');
    }

    onInit();

    function onLoad() {
        $('.page-background-container.loading').addClass('loaded');

        setTimeout(function() {
            $('.nav-inner, .secondary-nav-inner').addClass('in-position');
            $('.page-background-container').removeClass('scale-down');
            $('.page[data-page-number="' + pageNumber + '"] .page-content .loading').addClass('loaded');
            setTimeout(function() {
                loading = false;
            }, 500);
        }, 750);
    }

    $(window).on('load', function() {
        onLoad();
    });

    var lastPageChangeTime = 0;
    $(window).bind('wheel', function(e) {
        var time = Math.round(e.timeStamp);
        var delta = e.originalEvent.wheelDelta || (e.originalEvent.deltaY * -1);
        if (delta > 0) {
            snapToPage('up', time);
        } else {
            snapToPage('down', time);
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
                snapToPage('up', touchUpTime);
            } else if (touchUp < touchDown - 30) {
                snapToPage('down', touchUpTime);
            }
        } else { // instant touchmove
            if (touchUp > touchDown + 15) {
                snapToPage('up', touchUpTime);
            } else if (touchUp < touchDown - 15) {
                snapToPage('down', touchUpTime);
            }
        }
    });

    function snapToPage(direction, time) {
        if ($('section.fullscreen').hasClass('active')) {
            // check if done loading, isn't the first page change and if another page animation isn't in progress
            if (loading || (lastPageChangeTime !== 0 && (time < lastPageChangeTime + 2250))) {
                return false;
            }

            var lastPageNumber = pageNumber;
            if (direction == 'up') {
                if (pageNumber > 1) {
                    pageNumber--;
                } else {
                    return false;
                }
            } else if (direction == 'down') {
                if (pageNumber < $('.page').length) {
                    pageNumber++;
                } else {
                    return false;
                }
            }
            
            // update time
            lastPageChangeTime = time;

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
            
            // second animations
            setTimeout(function() {
                var scrollTo = page[0].offsetTop;
                $('.fullscreen').animate({
                    scrollTop: scrollTo
                }, 750, $.bez([0.77, 0, 0.175, 1]), function() {
                    $('.page-background-container').removeClass('scale-down');
                    $('.page[data-page-number="' + pageNumber + '"] .page-content .loading').addClass('loaded');
                    
                    // reset
                    $('.page-background.hide-up').removeClass('hide-up');
                    $('.page-background.hide-down').removeClass('hide-down');
                    $('.page-background.below').removeClass('below');
                    $('.page-background.above').removeClass('above');
                    $('.page-background.slide-in').removeClass('slide-in');
                });    

                if (direction == 'up') {
                    lastPageBackground.addClass('hide-down');
                } else {
                    lastPageBackground.addClass('hide-up');
                }

                $('.second-highest-z').removeClass('second-highest-z');
                lastPageBackgroundContainer.addClass('second-highest-z');
                $('.highest-z').removeClass('highest-z');
                pageBackgroundContainer.addClass('highest-z');
                pageBackground.addClass('slide-in');
            }, 750);
        }
    }

    function snapToSection(direction) {
        // reset
        $('section').removeClass('hide-up').removeClass('hide-down').removeClass('above').removeClass('below').removeClass('slide-in');

        var lastSectionNumber = sectionNumber;
        if (direction == 'up') {
            if (sectionNumber > 1) {
                sectionNumber--;
            } else {
                return false;
            }
        } else if (direction == 'down') {
            if (sectionNumber < $('section').length) {
                sectionNumber++;
            } else {
                return false;
            }
        }

        var lastSection = $('section[data-section-number="' + lastSectionNumber + '"]');
        var section = $('section[data-section-number="' + sectionNumber + '"]');

        lastSection.removeClass('active');
        section.addClass('active');

        // set position
        if (direction == 'up') {
            section.addClass('above');
        } else {
            section.addClass('below');
        }

        setTimeout(function() {
            if (direction == 'up') {
                lastSection.addClass('hide-down');
            } else {
                lastSection.addClass('hide-up');
            }
            section.addClass('slide-in');
        }, 100);

        if (sectionNumber !== 1) {
            $('.up-arrow').addClass('active');
        } else {
            $('.up-arrow').removeClass('active');
        }
    }

    $(window).resize(function() {
        var scrollTo = $('.page[data-page-number="' + pageNumber + '"]')[0].offsetTop;
        if (scrollTo !== 0) {
            $('.fullscreen').scrollTop(scrollTo);
        }
    });

    $('#view-work-button').on('click touch', function() {
        snapToSection('down');
    });

    $('.up-arrow').on('click touch', function() {
        snapToSection('up');
    });

    function addClassLoaded(el) {
        el.addClass('loaded');
    }
});