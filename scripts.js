const apiKey = '1bfdbff05c2698dc917dd28c08d41096';
const baseUrl = 'https://api.themoviedb.org/3/search/movie';
const resultsContainer = document.getElementById('results');

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
        
            listItem.innerHTML = `<div ondblclick="showMovieDetails(${movie.id})"><strong>${movie.title}</strong> (${movie.release_date})<br><img class=posterImg src="${posterUrl}" alt="${movie.title} Poster"></div>`;
        resultsContainer.appendChild(listItem);
    });
}

function showMovieDetails(movieId) {
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

    // Make the API request to get detailed information
    axios.get(detailsUrl)
        .then(response => displayMovieDetails(response.data))
        .catch(error => console.error('Error fetching movie details:', error));
}

const displayMovieDetails = async(movie) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${apiKey}&language=en-US&page=1`)
    const data = await response.json()
    console.log(movie)
    const posterPath = movie.poster_path;
    const posterUrl = posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : 'placeholder_image_url.jpg';  // Provide a placeholder image URL if no poster is available
    resultsContainer.innerHTML = `<div>
                                    <img class=posterDetails src="${posterUrl}" alt="${movie.title} Poster"><br>
                                    <strong>${movie.title}</strong><br>
                                    <p id='release_date'>Release Date: (${movie.release_date})</p>
                                    <p>Original Title: ${movie.original_title}</p>
                                    <p>Original Language: ${movie.original_language}</p>
                                    <p>Genre: ${movie.genres.map((data) => data.name).join(' ')}</p>
                                    <img class=backdrop src="http://image.tmdb.org/t/p/w500/${movie.backdrop_path}"> 
                                    <p id="summary">Summary: ${movie.overview}<p> 

                                    <div> 
                                        ${data.results.map((data) => (
                                            `<div ondblclick="showMovieDetails(${data.id})"><strong>${data.title}</strong> (${data.release_date})<br><img class=posterImg src="http://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.title} Poster"></div>`

                                        ))}
                                    </div>
                                    </div>`

}

