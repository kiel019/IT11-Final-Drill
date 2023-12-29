const apiKey = '1bfdbff05c2698dc917dd28c08d41096';
const baseUrl = 'https://api.themoviedb.org/3/search/movie';

function searchMovies() {
    const query = document.getElementById('search').value;

    // Make sure the user entered a query
    if (query.trim() === '') {
        alert('Please enter a movie title.');
        return;
    }

    // Construct the URL for the TMDb API request
    const url = `${baseUrl}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    // Make the API request using Axios
    axios.get(url)
        .then(response => displayResults(response.data.results))
        .catch(error => console.error('Error fetching data:', error));
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.classList.add('movie');
        // Check if the movie has a poster path
        const posterPath = movie.poster_path;
        const posterUrl = posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : 'placeholder_image_url.jpg';  // Provide a placeholder image URL if no poster is available
        listItem.innerHTML = `<strong>${movie.title}</strong> (${movie.release_date})<br><img src="${posterUrl}" alt="${movie.title} Poster"><br>${movie.overview}`;
        resultsContainer.appendChild(listItem);
    });
}