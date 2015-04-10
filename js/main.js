'use strict';

function link(e) {
    this.style.backgroundImage = window.getComputedStyle(this).backgroundImage
        .replace(
            /%23[0-9a-f]+/g,
            '%23' + ( e.type == 'mouseout' ? '777' : this.dataset.color )
        );
}

window.onload = function() {
    var links = document.querySelectorAll('footer a');

    for ( var i = 0; i < links.length; i++ ) {
        links[i].addEventListener('mouseenter', link);
        links[i].addEventListener('mouseout',   link);
    }
};
