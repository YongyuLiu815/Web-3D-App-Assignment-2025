document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 Script Loaded Successfully!");

    // Get dropdown menu elements
    const lightingDisplay = document.getElementById("lighting-display");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    // Show dropdown menu when hovering over the navigation item
    lightingDisplay.addEventListener("mouseenter", () => {
        dropdownMenu.classList.add("show");
    });

    // Hide dropdown menu when the mouse leaves
    lightingDisplay.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!dropdownMenu.matches(":hover")) {
                dropdownMenu.classList.remove("show");
            }
        }, 300); // Delay to prevent sudden disappearance
    });

    // Toggle dropdown menu on click
    lightingDisplay.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default link behavior
        dropdownMenu.classList.toggle("show");
    });

    // Mapping of navigation links and model preview cards to their respective pages
    const models = {
        "nav-chinese-lamp_1": "chinese_lamp_1.html",
        "nav-chinese-lamp_2": "chinese_lamp_2.html",
        "nav-euro1": "european_lamp_1.html",
        "nav-euro2": "european_lamp_2.html",
        "chinese-lamp1-card": "chinese_lamp_1.html",
        "chinese-lamp2-card": "chinese_lamp_2.html",
        "euro-lamp1-card": "european_lamp_1.html",
        "euro-lamp2-card": "european_lamp_2.html"
    };

    // Add click event to each element to navigate to the corresponding page
    Object.keys(models).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("click", () => {
                window.location.href = models[id];
            });
        }
    });
});
