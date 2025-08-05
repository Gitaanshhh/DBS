document.addEventListener("DOMContentLoaded", function () {
  // Load venues from backend for main page
  loadMainPageVenues();
  
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

// Function to load venues from backend for main page
async function loadMainPageVenues() {
  try {
    console.log('Attempting to fetch venues from backend...');
    const response = await fetch('http://localhost:8000/api/venues/');
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch venues: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Venues data received:', data);
    const venues = data.venues || [];
    console.log('Number of venues:', venues.length);
    
    // Get the venues section
    const venuesContainer = document.querySelector('.venues');
    console.log('Venues container found:', !!venuesContainer);
    
    if (venuesContainer) {
      // Clear existing hardcoded venues
      venuesContainer.innerHTML = '';
      
      // Show only first 3 venues for main page
      const featuredVenues = venues.slice(0, 3);
      console.log('Featured venues:', featuredVenues);
      
      featuredVenues.forEach(venue => {
        const venueCard = createMainPageVenueCard(venue);
        venuesContainer.appendChild(venueCard);
      });
      
      // Re-attach event listeners to new venue cards
      attachMainPageEventListeners();
      console.log('Venues loaded successfully');
    } else {
      console.error('Venues container not found');
    }
  } catch (error) {
    console.error('Error loading venues for main page:', error);
    // Show error message to user
    const venuesContainer = document.querySelector('.venues');
    if (venuesContainer) {
      venuesContainer.innerHTML = `
        <div class="error-message">
          <p>Failed to load venues: ${error.message}</p>
          <p>Please check if the backend server is running on http://localhost:8000</p>
        </div>
      `;
    }
  }
}

// Function to create venue card for main page
function createMainPageVenueCard(venue) {
  const article = document.createElement('article');
  article.className = 'venue';
  article.dataset.venueId = venue.venue_id;
  
  // Determine venue type icon
  let iconClass = 'fas fa-building';
  if (venue.venue_type?.toLowerCase().includes('lab')) {
    iconClass = 'fas fa-flask';
  } else if (venue.venue_type?.toLowerCase().includes('hall')) {
    iconClass = 'fas fa-chalkboard';
  } else if (venue.venue_type?.toLowerCase().includes('auditorium')) {
    iconClass = 'fas fa-theater-masks';
  } else if (venue.venue_type?.toLowerCase().includes('conference')) {
    iconClass = 'fas fa-users';
  }
  
  article.innerHTML = `
    <img src="https://via.placeholder.com/400x250/4a90e2/ffffff?text=${encodeURIComponent(venue.venue_name)}" alt="${venue.venue_name}">
    <div class="venue-content">
      <div>
        <h3 class="venue-title">${venue.venue_name}</h3>
        <p class="venue-location">
          <i class="fas fa-map-marker-alt"></i> Floor ${venue.floor_number || 'N/A'}
        </p>
        <p class="venue-capacity">
          <i class="fas fa-users"></i> Capacity: ${venue.seating_capacity || 'N/A'} people
        </p>
        <div class="venue-features">
          <span class="feature">Projector</span>
          <span class="feature">Wi-Fi</span>
          <span class="feature">Air Conditioned</span>
        </div>
      </div>
      <button class="book-btn">Book Now</button>
    </div>
  `;
  
  return article;
}

// Function to attach event listeners to main page venue cards
function attachMainPageEventListeners() {
  const bookButtons = document.querySelectorAll(".book-btn");
  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get venue information from the parent elements
      const venueCard = this.closest(".venue");
      const venueTitle = venueCard.querySelector(".venue-title").textContent;
      const venueLocation = venueCard.querySelector(".venue-location").textContent;
      const venueCapacity = venueCard.querySelector(".venue-capacity").textContent;
      const venueImage = venueCard.querySelector("img").src;
      const venueId = venueCard.dataset.venueId;

      // Store venue information in localStorage to pass to the booking page
      localStorage.setItem(
        "selectedVenue",
        JSON.stringify({
          id: venueId,
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
}
