document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const inboxTabs = document.querySelectorAll(".inbox-tab");

  inboxTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      inboxTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // In a real application, this would load different conversation lists
      const tabType = this.getAttribute("data-tab");

      if (tabType === "admin") {
        // Show only admin conversations
        document.querySelectorAll(".conversation").forEach((conv) => {
          if (
            conv
              .querySelector(".conversation-avatar")
              .classList.contains("admin")
          ) {
            conv.style.display = "flex";
          } else {
            conv.style.display = "none";
          }
        });
      } else {
        // Show all conversations
        document.querySelectorAll(".conversation").forEach((conv) => {
          conv.style.display = "flex";
        });
      }
    });
  });

  // Conversation selection functionality
  const conversations = document.querySelectorAll(".conversation");

  conversations.forEach((conv) => {
    conv.addEventListener("click", function () {
      // Remove active class from all conversations
      conversations.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked conversation
      this.classList.add("active");

      // In a real application, this would load the selected conversation
      const conversationId = this.getAttribute("data-conversation");
      const conversationName =
        this.querySelector(".conversation-name").textContent;

      // Update chat header
      document.querySelector(".contact-name").textContent = conversationName;

      // Remove badge if present
      const badge = this.querySelector(".conversation-badge");
      if (badge) {
        badge.remove();
      }

      // In a real application, this would load the conversation messages
      // For now, we'll just show a message
      if (conversationId !== "tech-society") {
        alert(
          `Loading conversation with ${conversationName}... This would load different messages in a real application.`
        );
      }
    });
  });

  // Message sending functionality
  const chatInput = document.querySelector(".chat-input input");
  const sendBtn = document.querySelector(".send-btn");

  function sendMessage() {
    const messageText = chatInput.value.trim();

    if (messageText === "") {
      return;
    }

    // Get current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;

    // Create new message element
    const messageElement = document.createElement("div");
    messageElement.className = "message sent";
    messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">
                    <p>${messageText}</p>
                </div>
                <div class="message-time">${timeString}</div>
            </div>
        `;

    // Add message to chat
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.appendChild(messageElement);

    // Clear input
    chatInput.value = "";

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // In a real application, this would send the message to the server
    // For now, we'll simulate a reply after a short delay
    setTimeout(() => {
      const replyElement = document.createElement("div");
      replyElement.className = "message received";
      replyElement.innerHTML = `
                <div class="message-avatar">
                    <img src="https://via.placeholder.com/40" alt="Tech Society">
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>Thanks for your message! I'll get back to you soon.</p>
                    </div>
                    <div class="message-time">${timeString}</div>
                </div>
            `;

      chatMessages.appendChild(replyElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
  }

  sendBtn.addEventListener("click", sendMessage);

  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Attachment button functionality
  const attachmentBtn = document.querySelector(".attachment-btn");

  attachmentBtn.addEventListener("click", function () {
    alert("File attachment would open a file picker in a real application.");
  });

  // Action buttons functionality
  const actionBtns = document.querySelectorAll(".action-btn");

  actionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const icon = this.querySelector("i");

      if (icon.classList.contains("fa-phone")) {
        alert(
          "Voice call functionality would be implemented in a real application."
        );
      } else if (icon.classList.contains("fa-video")) {
        alert(
          "Video call functionality would be implemented in a real application."
        );
      } else if (icon.classList.contains("fa-info-circle")) {
        alert("Contact information would be displayed in a real application.");
      }
    });
  });

  // Search functionality
  const searchInput = document.querySelector(".inbox-search input");
  const searchBtn = document.querySelector(".inbox-search button");

  searchBtn.addEventListener("click", function () {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
      return;
    }

    // Filter conversations
    conversations.forEach((conv) => {
      const name = conv
        .querySelector(".conversation-name")
        .textContent.toLowerCase();
      const preview = conv
        .querySelector(".conversation-preview")
        .textContent.toLowerCase();

      if (name.includes(searchTerm) || preview.includes(searchTerm)) {
        conv.style.display = "flex";
      } else {
        conv.style.display = "none";
      }
    });
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  // Clear search when input is cleared
  searchInput.addEventListener("input", function () {
    if (this.value === "") {
      conversations.forEach((conv) => {
        conv.style.display = "flex";
      });
    }
  });
});
