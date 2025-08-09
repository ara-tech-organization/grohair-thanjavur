(function ($) {
  "use strict";

  // Dropdown on mouse hover
  $(document).ready(function () {
    function toggleNavbarMethod() {
      if ($(window).width() > 992) {
        $(".navbar .dropdown")
          .on("mouseover", function () {
            $(".dropdown-toggle", this).trigger("click");
          })
          .on("mouseout", function () {
            $(".dropdown-toggle", this).trigger("click").blur();
          });
      } else {
        $(".navbar .dropdown").off("mouseover").off("mouseout");
      }
    }
    toggleNavbarMethod();
    $(window).resize(toggleNavbarMethod);
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Date and time picker
  $("#date").datetimepicker({
    format: "L",
  });
  $("#time").datetimepicker({
    format: "LT",
  });

  // Service carousel
  $(".service-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    loop: true,
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  });
  $(".img-carousel").owlCarousel({
    autoplay: true,
    autoplayHoverPause: true, // stops when user hovers/taps
    smartSpeed: 1500,
    loop: true,
    margin: 20,
    dots: false,
    nav: true, // enable arrows
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  });
  $(".portfolio-carousel").owlCarousel({
    autoplay: true,
    autoplayHoverPause: true,
    smartSpeed: 1200,
    loop: true,
    margin: 20,
    dots: false,
    nav: true,
    navText: [
      '<i class="fa fa-chevron-left"></i>',
      '<i class="fa fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });

  $(".treatment-carousel").owlCarousel({
    autoplay: true,
    autoplayTimeout: 3000, // 3 seconds per slide
    smartSpeed: 800,
    margin: 20,
    loop: true,
    dots: false,
    nav: true,
    navText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>",
    ],
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      992: { items: 4 },
    },
  });

  // Pricing carousel
  var $carousel = $(".pricing-carousel");

  $carousel.owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    margin: 30,
    loop: true,
    dots: false,
    nav: false,
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 2 },
    },
  });

  // Stop autoplay when video starts
  $carousel.find("video").on("play", function () {
    $carousel.trigger("stop.owl.autoplay");
  });

  // Resume autoplay when paused or ended
  $carousel.find("video").on("pause ended", function () {
    $carousel.trigger("play.owl.autoplay");
  });

  // Testimonialss carousel
  $(".Testimonials-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    margin: 30,
    dots: true,
    loop: true,
    items: 1,
  });
})(jQuery);
