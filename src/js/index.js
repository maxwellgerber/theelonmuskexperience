(function () {
    var sounds = [];
    var howls = [];
    var talking = false;
    var chinClasses = ['chew', 'chomp'];

    for (var i = 2; i < 6; i++) {
        sounds[i - 2] = 'audio/EM' + i + '.mp3';
    }

    for (var i = 0; i < sounds.length; i++) {
        howls[i] = new Howl({
            src: [sounds[i]],
            preload: true,
            onload: function (num) {
                return function () {
                    console.log('Sound ' + sounds[num] + ' loaded');
                }
            }(i)
        });
    }

    $(document).ready(function () {

        var chin = $("#chin");

        var container = $(".centered");

        chin.click(function () {

            if (talking) return;
            talking = true;

            var soundToPlay = getRandomInt(0, howls.length - 1);
            var classToUse = getRandomInt(0, chinClasses.length - 1);

            howls[soundToPlay].play();
            howls[soundToPlay].on('end', function () {
                console.log('Finished!');
                chin.removeClass();
                container.removeClass('shake');
                talking = false;
            });

            chin.addClass(chinClasses[classToUse]);
            container.addClass('shake');
            function handleAnimationEnd(e) {
                console.log("that's a wrap");
                chin.removeClass(chinClasses[classToUse]);
                var nextClassToUse = getRandomIntExcluding(0, chinClasses.length - 1, classToUse)
                chin.addClass(chinClasses[nextClassToUse]);
                classToUse = nextClassToUse;
            }

            function attatchRecursiveAnimationEndListener() {
                onAnimationEnd(chin, function () {
                    handleAnimationEnd();
                    if (talking) {
                        attatchRecursiveAnimationEndListener();
                    }
                });
            }

            attatchRecursiveAnimationEndListener();
        });


    });
})();

