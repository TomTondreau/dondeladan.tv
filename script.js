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

    // TheTVDB API Configuration
    const THE_TVDB_API_KEY = 'c8d9787c-ffe0-4ac8-a6f9-95f1ee12e48d';
    const THE_TVDB_BASE_URL = 'https://api4.thetvdb.com/v4';
    let bearerToken = null; // To store the authentication token

    // Function to get the bearer token
    async function getBearerToken() {
        try {
            const response = await fetch(`${THE_TVDB_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ apikey: THE_TVDB_API_KEY })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            bearerToken = data.data.token;
            console.log('Bearer Token obtained:', bearerToken);
            return bearerToken;
        } catch (error) {
            console.error('Error obtaining bearer token:', error);
            alert('Error al autenticarse con TheTVDB. Por favor, inténtalo de nuevo más tarde.');
            return null;
        }
    }

    // Function to perform the search
    async function performSearch(query) {
        if (!bearerToken) {
            console.log('No bearer token available, attempting to get one...');
            const token = await getBearerToken();
            if (!token) {
                return; // Cannot proceed without a token
            }
        }

        try {
            const response = await fetch(`${THE_TVDB_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`
                }
            });

            if (!response.ok) {
                // If token expired or invalid, try to get a new one and retry the search
                if (response.status === 401) { // Unauthorized
                    console.log('Token expired or invalid, attempting to refresh...');
                    bearerToken = null; // Clear old token
                    const newToken = await getBearerToken();
                    if (newToken) {
                        return performSearch(query); // Retry search with new token
                    } else {
                        throw new Error('Failed to refresh token and retry search.');
                    }
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Search results:', data);
            displayResults(data.data.results); // Assuming results are in data.data.results
        } catch (error) {
            console.error('Error performing search:', error);
            alert('Error al realizar la búsqueda. Por favor, inténtalo de nuevo más tarde.');
        }
    }

    // Function to display search results
    function displayResults(results) {
        resultsGrid.innerHTML = ''; // Clear previous results

        if (!results || results.length === 0) {
            resultsGrid.innerHTML = '<p>No se encontraron resultados.</p>';
            return;
        }

        results.forEach(item => {
            if (item.type === 'movie' || item.type === 'series') {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.title = item.name; // 'name' for title
                card.dataset.description = item.overview || 'No description available.'; // 'overview' for description
                card.dataset.platforms = 'Información de plataformas no disponible directamente en la búsqueda.'; // Placeholder for now

                const imageUrl = item.image_url || 'https://via.placeholder.com/150x220?text=No+Image';

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>${item.overview ? item.overview.substring(0, 100) + '...' : 'No description available.'}</p>
                    <p>Tipo: ${item.type === 'movie' ? 'Película' : 'Serie'}</p>
                `;
                resultsGrid.appendChild(card);
            }
        });
    }

    // Initial token acquisition when the page loads
    getBearerToken();

    // Modify search button click listener
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        } else {
            alert('Por favor, ingresa algo para buscar.');
        }
    });

    // Handle card clicks to open modal (keep existing logic, but data will come from API results)
    resultsGrid.addEventListener('click', function(event) {
        const card = event.target.closest('.card');
        if (card) {
            modalTitle.textContent = card.dataset.title;
            modalImage.src = card.querySelector('img').src;
            modalDescription.textContent = card.dataset.description;
            modalPlatforms.textContent = card.dataset.platforms; // This will be updated later
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