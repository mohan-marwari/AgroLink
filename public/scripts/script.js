// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  // filter script for listing page 

  document.addEventListener("DOMContentLoaded", function () {
    const filters = document.getElementById("filters");
    const scrollLeft = document.getElementById("scrollLeft");
    const scrollRight = document.getElementById("scrollRight");
  
    // Show/Hide Buttons based on scroll position
    const updateScrollButtons = () => {
      const maxScrollLeft = filters.scrollWidth - filters.clientWidth;
      scrollLeft.classList.toggle("d-none", filters.scrollLeft <= 0);
      scrollRight.classList.toggle("d-none", filters.scrollLeft >= maxScrollLeft);
    };
  
    scrollLeft.addEventListener("click", () => {
      filters.scrollBy({ left: -200, behavior: "smooth" });
    });
  
    scrollRight.addEventListener("click", () => {
      filters.scrollBy({ left: 200, behavior: "smooth" });
    });
  
    filters.addEventListener("scroll", updateScrollButtons);
  
    // Initial check for buttons
    updateScrollButtons();
  });
  