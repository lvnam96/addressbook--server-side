// CORE functions
function getLang () {
    var lang = (jQuery('html').attr('lang') || "").toLowerCase();
    return (lang || "").substring(0, 2);
}

// DOM manipulation
document.addEventListener('DOMContentLoaded', function () {
    var win = window;// Optimization: store ref inside callback
    // var scrollToTopBtn = document.getElementsByClassName('go-top-btn')[0];
    var navbarContainer = document.getElementById('wrapper-navbar');
    var navbar = document.getElementsByClassName('navbar')[0];
    var callToActionBar = document.getElementsByClassName('cta-info-bar')[0];
    var navToggler = document.getElementsByClassName('navbar-toggler')[0];
    // var isNavbarExpanded = navToggler.getAttribute('aria-expanded') === 'true';
    // var navLogo = document.getElementsByClassName('nav__logo')[0];
    // var navToggler = document.getElementById('fullpage-nav-toggler');
    // var fullpageNav = document.getElementsByClassName('fullpage-nav-wrapper')[0];
    // fullpageNav.addEventListener('click', e => {
    //     var { target } = e;
    //     if (target.tagName.toUpperCase() === 'DIV' && target.className === 'fullpage-nav__item') {
    //         navToggler.checked = false;
    //     }
    // });

    // show/hide when scrolling
    var previousPosition = 0;
    // var navbarHeight = navbar.clientHeight;
    // var callToActionBarHeight = callToActionBar.clientHeight;
    var userHasScrolledPos = 50;

    function showSTTBtnWhenScrollTo(currentPosition) {
        if (currentPosition >= 300 && win.innerWidth > 1024) {
            // scrollToTopBtn.style.display = 'block';
        } else {
            // scrollToTopBtn.style.display = 'none';
            navbarContainer.style.transform = 'none';
        }
    }

    function toggleShowHideNav(currentPosition) {
        var isNavbarExpanded = navToggler.getAttribute('aria-expanded') === 'true';
        if (!isNavbarExpanded) {
            if (currentPosition >= userHasScrolledPos) {
                // if (navToggler.checked) {
                //     // DO SOMETHING HERE TO FIX A RELATED BUG
                // } else {
                if (currentPosition > previousPosition) {
                    navbarContainer.style.transform = 'translate(0, -100%)';
                } else {
                    navbarContainer.style.transform = 'none';
                }
                // }
            }
        }
    }

    // function turnNavColorToWhite () {
    //     navbarContainer.classList.add('nav--white');
    //     getBlueLogo();
    // }
    // function turnNavColorToTransparent () {
    //     navbarContainer.classList.remove('nav--white');
    //     // getWhiteLogo();
    // }
    // function getBlueLogo () {
    //     navLogo.src = "/up4d/assets/imgs/logo--blue.png";
    // }
    // function getOriginalLogo () {
    //     navLogo.src = "/up4d/assets/imgs/original-logo.png";
    // }
    // function getWhiteLogo () {
    //     navLogo.src = "/up4d/assets/imgs/logo--white.png";
    // }
    // function toggleNavBg (currentPosition) {
    //     if (currentPosition > userHasScrolledPos) {
    //         turnNavColorToWhite();
    //     } else {
    //         turnNavColorToTransparent();
    //     }
    // }
    // var combineNavHeight = callToActionBarHeight + navbarHeight;
    // function toggleCTABar(currentPosition) {
    //     if (currentPosition >= userHasScrolledPos) {
    //         callToActionBar.classList.add('hidden');
    //     } else {
    //         callToActionBar.classList.remove('hidden');
    //     }
    // }

    win.addEventListener('scroll', function (e) {
        var currentPosition = win.scrollY;
        win.requestAnimationFrame(function () {

            // try {
            //     showSTTBtnWhenScrollTo(currentPosition);
            // } catch (err) {}

            try {
                toggleShowHideNav(currentPosition);
            } catch (err) {}

            // if (win.innerWidth > 992) {
            //     try {
            //         if (!navToggler.checked) {
            //             // toggleNavBg(currentPosition);
            //         toggleCTABar(currentPosition);
            //         }
            //     } catch (err) {}
            // }

            //remember the position scrolled to
            previousPosition = currentPosition;
        });
    });

    // navToggler.addEventListener('change', e => {
    //     if (e.target.checked) {
    //         getWhiteLogo();
    //         // turnNavColorToTransparent();
    //         callToActionBar.classList.add('hidden');
    //     } else {
    //         // getBlueLogo();
    //         getOriginalLogo();
    //         // toggleNavBg(previousPosition);
    //         toggleCTABar(previousPosition);
    //     }
    // });
});
