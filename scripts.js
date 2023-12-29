const apiKey = '1bfdbff05c2698dc917dd28c08d41096';
const baseUrl = 'https://api.themoviedb.org/3/search/movie';
const resultsContainer = document.getElementById('results');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
let page = 1;

function nextPage() {
    page++;
    upcomingMovies();
}

function prevPage() {
    if (page > 1) {
        page--;
        upcomingMovies();
    }
    else {
        page = 1;
        upcomingMovies();
    }
}

const upcomingMovies = async() =>{
    window.scrollTo(0,0);
    const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}`)
    const data = await response.json()
    resultsContainer.innerHTML = `
        <strong class='um'>Upcoming Movies</strong>
        <div class='upcomingMovies'>
        ${data.results.slice(0, 15).map((data)=> (
        `<div class='uMovies' ondblclick="showMovieDetails(${data.id})">
        <img class=posterImg src="http://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.title} Poster">
        <strong>${data.title}</strong> (${data.release_date})
        </div>`)).join('')}
        </div>`
}

upcomingMovies()

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
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(movie => {
        window.scrollTo(0,0);
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
    window.scrollTo(0,0);
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${apiKey}&language=en-US&page=1`)
    const data = await response.json()
    console.log(movie)
    const posterPath = movie.poster_path;
    const posterUrl = posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : 'placeholder_image_url.jpg';  // Provide a placeholder image URL if no poster is available
    const backdropUrl = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : 'placeholder_image_url.jpg'; // Provide a placeholder image URL if no backdrop is available
    resultsContainer.innerHTML = `<a href='${backdropUrl}'><div class="banner" style="background-image: url('${backdropUrl}')"></div></a>
                                    <div class=movieDetails>
                                    <img class=posterDetails src="${posterUrl}" alt="${movie.title} Poster">
                                    <div>
                                    <strong class='mTitle'>${movie.title}</strong><br><br>
                                    <p id='release_date'><strong>Release Date:</strong> (${movie.release_date})</p><br>
                                    <p><strong>Original Title:</strong> ${movie.original_title}</p><br>
                                    <p><strong>Original Language:</strong> ${movie.original_language}</p><br>
                                    <p><strong>Genre:</strong> ${movie.genres.map((data) => data.name).join(' ')}</p><br>
                                    <p id="summary"><strong>Summary:</strong><br> ${movie.overview}<p> </div>
                                    </div>
                                    <strong class='tsm'>Similar Movies</strong>
                                    <div class=similarMovies> 
                                        ${data.results.slice(0, 5).map((data) => (
                                            `<div class=sMovies ondblclick="showMovieDetails(${data.id})">
                                            <img class=posterImg src="http://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.title} Poster"><br>
                                            <strong>${data.title}</strong></div>`
                                        )).join('')}
                                    </div>`                                    
}

