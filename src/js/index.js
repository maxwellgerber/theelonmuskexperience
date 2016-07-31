function addClassTemporary(element, newClass, duration){
    element = $(element);
    element.click(
        function() {
            element.addClass(newClass);
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass(newClass);
            }, duration);

        });
}

//addClassTemporary('#chin', 'down', 200);

function dropElementDown(element, distance, duration){
    var elem = $(element);
    var orig = elem.css('transform');
    elem.css('transform', 'translateY(' + distance +'px)');
    window.setTimeout( function(){
        element.css('transform', orig);
    }, duration);
}

while(1){
    window.setInterval( function(){
        dropElementDown('#chin', 20, 240);
    }, 3000);

}