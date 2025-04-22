document.addEventListener("DOMContentLoaded", function () {
  // Hamburger menu functionality
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close the menu when a link is clicked
    const navItems = document.querySelectorAll(".nav-links a");
    navItems.forEach((item) => {
      item.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks2 = document.querySelectorAll(".nav-links a");

  navLinks2.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "mainPage.html") ||
      (currentPage === "/" && linkPage === "mainPage.html")
    ) {
      link.classList.add("active");
    }
  });

  // Category item selection
  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all items
      categoryItems.forEach((i) => i.classList.remove("active"));
      // Add active class to clicked item
      this.classList.add("active");
    });
  });

  // Initialize date inputs with current date
  const dateInputs = document.querySelectorAll('input[type="date"]');
  if (dateInputs.length > 0) {
    const today = new Date().toISOString().split("T")[0];
    dateInputs.forEach((input) => {
      if (!input.min) {
        input.min = today;
      }
      if (!input.value) {
        input.value = today;
      }
    });
  }

  // Book Now button functionality
  const bookButtons = document.querySelectorAll(".book-btn");
  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get venue information from the parent elements
      const venueCard = this.closest(".venue");
      const venueTitle = venueCard.querySelector(".venue-title").textContent;
      const venueLocation =
        venueCard.querySelector(".venue-location").textContent;
      const venueCapacity =
        venueCard.querySelector(".venue-capacity").textContent;
      const venueImage = venueCard.querySelector("img").src;

      // Store venue information in localStorage to pass to the booking page
      localStorage.setItem(
        "selectedVenue",
        JSON.stringify({
          title: venueTitle,
          location: venueLocation,
          capacity: venueCapacity,
          image: venueImage,
        })
      );

      // Navigate to the booking page
      window.location.href = "booking.html";
    });
  });
});
