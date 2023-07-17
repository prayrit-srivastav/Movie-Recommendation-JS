const fs = require('fs');
const { JSDOM } = require('jsdom');
const fetchMock = require('jest-fetch-mock');
const path = require('path');
const { URL } = require('url');

describe('Movie Recommendation App', () => {
  let dom;
  let window;
  let document;
  let showRandomMovie;
  let populateGenreDropdown;
  let getGenres;

  beforeAll(() => {
    // Load the HTML file in jsdom
    const htmlFilePath = path.resolve(__dirname, './index.html');
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    dom = new JSDOM(htmlContent, { runScripts: 'dangerously', resources: 'usable' });
    window = dom.window;
    document = window.document;
    showRandomMovie = window.showRandomMovie;
    populateGenreDropdown = window.populateGenreDropdown;

    // Wait for the script to execute before proceeding
    return new Promise((resolve) => {
      window.addEventListener('load', () => {
        showRandomMovie = window.showRandomMovie;
        populateGenreDropdown = window.populateGenreDropdown;
        getGenres  = window.getGenres;
        resolve();
      });
    });
  });

  afterEach(() => {
    // Clean up after each test
    fetchMock.resetMocks();
    dom.window.close();
  });

  it('should fetch and populate the genre dropdown correctly', async () => {
    // Set up the response data for genres
    const genresData = { genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Comedy' }] };

    // Mock the API response for genre fetch
    fetchMock.mockResponseOnce(JSON.stringify(genresData));

    // Run the app logic to fetch and populate the genre dropdown
    await populateGenreDropdown(genresData.genres);

    // Assert that the dropdown has the correct options
    const genresDropdown = document.getElementById('genres');
    expect(genresDropdown.children).toHaveLength(2);
    expect(genresDropdown.children[0].value).toBe('1');
    expect(genresDropdown.children[0].textContent).toBe('Action');
    expect(genresDropdown.children[1].value).toBe('2');
    expect(genresDropdown.children[1].textContent).toBe('Comedy');
  });
  it('should load a new movie when the "Next" button is clicked', async () => {
    // ... (same setup as before)
  
    // Trigger the function to fetch and display a random movie
    getGenres();
    const genresDropdown = document.getElementById('genres');
    genresDropdown.value = '2'; // Set the selected genre to Comedy
    const searchButton = document.getElementById('playBtn');
    searchButton.click();
  
    // Wait for the async operation to complete (fetch and display the movie)
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    // Assert that the first movie information is displayed correctly
    let movieTitle = document.getElementById('movieTitle');
    expect(movieTitle.textContent).toBe('Movie 2');
  
    // Trigger the function to load the next random movie
    const nextButton = document.getElementById('likeBtn');
    nextButton.click();
  
    // Wait for the async operation to complete (fetch and display the next movie)
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    // Assert that the second movie information is displayed correctly
    movieTitle = document.getElementById('movieTitle');
    expect(movieTitle.textContent).toBe('Movie 3');
  });
  
  it('should fetch a random movie when the "Search" button is clicked', async () => {
    // ... (same setup as before)
  
    // Trigger the function to fetch and display a random movie
    getGenres();
    const genresDropdown = document.getElementById('genres');
    genresDropdown.value = '2'; // Set the selected genre to Comedy
    const searchButton = document.getElementById('playBtn');
  
    // Wait for the async operation to complete (fetch and display the movie)
    await new Promise((resolve) => {
      searchButton.click();
      setTimeout(resolve, 100);
    });
  
    // Assert that the movie information is displayed correctly
    const movieTitle = document.getElementById('movieTitle');
    const movieOverview = document.getElementById('movieOverview');
    const moviePoster = document.getElementById('moviePoster');
    expect(movieTitle.textContent).toBe('Movie 2');
    expect(movieOverview.textContent).toBe('Overview of Movie 2');
    expect(moviePoster.getAttribute('src')).toBe('https://image.tmdb.org/t/p/original//poster2.jpg');
  });
  test('getGenres should fetch and populate genre dropdown correctly', async () => {
    // Define the mocked response from the API
    const mockApiResponse = {
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comedy' },
        { id: 3, name: 'Drama' },
      ],
    };
  
    // Set up the fetch mock to return the mocked response
    fetchMock.mockResponseOnce(JSON.stringify(mockApiResponse));
  
    // Call the getGenres function
    getGenres();
  
    // Wait for the API call to complete (assuming getGenres makes the API call asynchronously)
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the timeout as needed
  
    // Assert that the genre dropdown has been populated correctly
    const select = document.getElementById('genres');
  
    expect(select.children.length).toBe(mockApiResponse.genres.length);
  
    for (let i = 0; i < mockApiResponse.genres.length; i++) {
      const option = select.children[i];
      expect(option.value).toBe(mockApiResponse.genres[i].id.toString());
      expect(option.textContent).toBe(mockApiResponse.genres[i].name);
    }
  });



//   it('should fetch and display a random movie correctly', async () => {
//     // Set up the response data for movies
//     const movieData = {
//       results: [
//         {
//           id: 1,
//           title: 'Movie 1',
//           overview: 'Overview of Movie 1',
//           poster_path: '/poster1.jpg',
//         },
//         {
//           id: 2,
//           title: 'Movie 2',
//           overview: 'Overview of Movie 2',
//           poster_path: '/poster2.jpg',
//         },
//       ],
//     };

//     // Mock the API response for movie fetch
//     fetchMock.mockResponseOnce(JSON.stringify(movieData));

//     // Run the app logic to fetch and display a random movie
//     await showRandomMovie();

//     // Assert that the movie information is displayed correctly
//     const movieTitle = document.getElementById('movieTitle');
//     const movieOverview = document.getElementById('movieOverview');
//     const moviePoster = document.getElementById('moviePoster');

//     expect(movieTitle.textContent).toBe('Movie 1');
//     expect(movieOverview.textContent).toBe('Overview of Movie 1');
//     expect(moviePoster.getAttribute('src')).toBe('https://image.tmdb.org/t/p/original//poster1.jpg');
//   });

  // Add more test cases for other functionalities of the app
});
