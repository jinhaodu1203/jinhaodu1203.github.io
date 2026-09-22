// ================================
// YEAR
// ================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ================================
// MOBILE MENU
// ================================

const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.getElementById("navLinks");


menuButton.addEventListener(
    "click",
    function () {

        navLinks.classList.toggle("open");

    }
);


document
    .querySelectorAll(".nav-links a")
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                navLinks.classList.remove("open");

            }
        );

    });


// ================================
// SCROLL REVEAL
// ================================

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        function (entries) {

            entries.forEach(
                function (entry) {

                    if (entry.isIntersecting) {

                        entry.target
                            .classList
                            .add("visible");

                        revealObserver
                            .unobserve(entry.target);

                    }

                }
            );

        },

        {

            threshold: 0.12,

            rootMargin:
                "0px 0px -40px 0px"

        }

    );


revealElements.forEach(
    function (element, index) {

        element.style.transitionDelay =
            `${Math.min(index % 3, 2) * 80}ms`;

        revealObserver.observe(element);

    }
);


// ================================
// SCROLL PROGRESS
// ================================

const scrollBar =
    document.getElementById("scrollBar");


window.addEventListener(
    "scroll",
    function () {

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight
            - window.innerHeight;

        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        scrollBar.style.width =
            progress + "%";

    }
);


// ================================
// ACTIVE NAV
// ================================

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );


window.addEventListener(
    "scroll",
    function () {

        let currentSection = "";


        sections.forEach(
            function (section) {

                const sectionTop =
                    section.offsetTop - 180;

                const sectionHeight =
                    section.offsetHeight;


                if (
                    window.scrollY >= sectionTop
                    &&
                    window.scrollY
                    < sectionTop + sectionHeight
                ) {

                    currentSection =
                        section.getAttribute("id");

                }

            }
        );


        navigationLinks.forEach(
            function (link) {

                link.classList.remove("active");


                if (
                    link.getAttribute("href")
                    === "#" + currentSection
                ) {

                    link.classList.add("active");

                }

            }
        );

    }
);