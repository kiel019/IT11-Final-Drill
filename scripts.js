const apiKey = 'YOUR_API_KEY';
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
        listItem.innerHTML = `<strong>${movie.title}</strong> (${movie.release_date})<br>${movie.overview}`;
        resultsContainer.appendChild(listItem);
    });
}