document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsGrid = document.getElementById('resultsGrid');
    const detailModal = document.getElementById('detailModal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalPlatforms = document.getElementById('modalPlatforms');

    // Simulate search functionality
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            const googleSearchUrl = `https://www.google.com/search?q=dónde+ver+${encodeURIComponent(query)}+películas+series+streaming`;
            window.open(googleSearchUrl, '_blank');
        } else {
            alert('Por favor, ingresa algo para buscar.');
        }
    });

    // Handle card clicks to open modal
    resultsGrid.addEventListener('click', function(event) {
        const card = event.target.closest('.card');
        if (card) {
            modalTitle.textContent = card.dataset.title;
            modalImage.src = card.querySelector('img').src;
            modalDescription.textContent = card.dataset.description;
            modalPlatforms.textContent = `Disponible en: ${card.dataset.platforms}`;
            detailModal.style.display = 'block';
        }
    });

    // Close modal when close button is clicked
    closeButton.addEventListener('click', function() {
        detailModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == detailModal) {
            detailModal.style.display = 'none';
        }
    });
});