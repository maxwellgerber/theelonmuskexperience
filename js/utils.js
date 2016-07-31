
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntExcluding(min, max, excluding) {
    var rand = getRandomInt(min, max);
    if(rand != excluding){
        return rand;
    } else{
        return getRandomIntExcluding(min, max, excluding)
    }
}

function addPx(base, toAdd){
    return (parseInt(base.replace(/px/,""), 10)+toAdd) + "px";
}

function toSelector(input){
    if(input instanceof jQuery){
        return input;
    } else{
        return $(input);
    }
}

function onAnimationEnd(elem, cb){
    toSelector(elem).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
        cb);
}

function onAnimationStart(elem, cb){
    toSelector(elem).one('webKitAnimationStart oanimationstart msAnimationStart animationstart',
        cb);
}

function onAnimationIteration(elem, cb){
    toSelector(elem).one('webKitAnimationIteration oanumationiteration msAnimationIteration animationiteration',
        cb);
}