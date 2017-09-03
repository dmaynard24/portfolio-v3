$(function() {
    function init() {
        $('.fade-in-down').each(function() {
            console.log($(this));
            $(this).addClass('active');
        });
    }

    init();
    
    function snapToPage() {
        $('.page').each(function(i, e) {
            console.log(e);
        });
    }
});