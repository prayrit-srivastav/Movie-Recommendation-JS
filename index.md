require('text-encoding').TextEncoder;
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
const XMLHttpRequest = require('xhr2');

// import fetchMock from 'fetch-mock';
// import axios from 'axios';

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");


// Replace the global XMLHttpRequest with the mock implementation from xhr2-mock
global.XMLHttpRequest = XMLHttpRequest;

function mockResponse(data, status = 200) {
  const xhr = new XMLHttpRequest();
  xhr.status = status;
  xhr.responseText = JSON.stringify(data);
  xhr.readyState = XMLHttpRequest.DONE;
  xhr.onreadystatechange();

  return xhr;
}

describe('Movie Recommendation App', () => {
  let dom;

  beforeEach(() => {
    // Create a new DOM instance before each test
    dom = new JSDOM(html, { runScripts: "dangerously" });

    // Set the global document and window to the new DOM instance
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    // Clean up after each test
    dom.window.close();
  });

  it('should fetch genres and populate dropdown', async () => {
    // Set up the response data for genres
    const genresData = { genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Comedy' }] };
    const xhrMock = mockResponse(genresData);

    // Run the movie recommendation code (assuming it's in a <script> tag in the HTML)
    dom.window.eval(html);

    // Wait for the movie genres to be populated in the dropdown
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100); // Adjust the timeout if needed
    });

    // Assert that the dropdown has the correct options
    const genresDropdown = dom.window.document.getElementById('genres');
    expect(genresDropdown.children).toHaveLength(2);
    expect(genresDropdown.children[0].value).toBe('1');
    expect(genresDropdown.children[0].text).toBe('Action');
    expect(genresDropdown.children[1].value).toBe('2');
    expect(genresDropdown.children[1].text).toBe('Comedy');

    // Assert that the XMLHttpRequest was called with the correct URL
    expect(xhrMock.open).toHaveBeenCalledWith('GET', expect.stringContaining('genre/movie/list'), true);
  });

  // Add more test cases for other functionalities of the app
  // For example, you can test the movie search and display functionality
});



































// let dom;
// let document;
// let window;

// // const XMLHttpReq = jest.fn(() => ({
// //   open: jest.fn(),
// //   send: jest.fn(),
// //   readyState: 4,
// //   status: 200,
// //   responseText: JSON.stringify({
// //     genres: [
// //       { id: 1, name: 'Action' },
// //       { id: 2, name: 'Comedy' },
// //       { id: 3, name: 'Drama' },
// //     ],
// //   }),
// // }));


// // // let open, send, onload, onerror;

// // // function createXHRmock() {
// // //   const open = jest.fn();

// // //   // Be aware we use *function* because we need to get *this*
// // //   // from *new XMLHttpRequest()* call
// // //   const send = jest.fn().mockImplementation(function() {
// // //       this.onload = this.onload.bind(this);
// // //       this.onerror = this.onerror.bind(this);
// // //   });

// // //   const xhrMockClass = function () {
// // //       return {
// // //           open,
// // //           send,
// // //           responseText: JSON.stringify({
// // //                 genres: [
// // //                   { id: 1, name: 'Action' },
// // //                   { id: 2, name: 'Comedy' },
// // //                   { id: 3, name: 'Drama' },
// // //                 ],
// // //               }),
// // //       };
// // //   };

// //   // global.XMLHttpRequest = window.XMLHttpRequest;
// // global.XMLHttpRequest = require('xhr2');

// //   console.log(XMLHttpRequest);
// // // }
// window.XMLHttpRequest = jest.fn().mockImplementation(XMLHttpReq);
// describe("The final output has been printed correctly", () => {
//   beforeEach(() => {
//     dom = new JSDOM(html, { runScripts: "dangerously" });
//     document = dom.window.document;
//     window = dom.window;
//   });
//   it('should populate the genre dropdown', () => {
//     createXHRmock();
//     // Get the genre dropdown element
//     // const genreDropdown = getByTestId(document.body, 'genres');
//     const genreDropdown = document.querySelector('#genres');

//     // Check if the dropdown options are populated correctly
//     expect(genreDropdown.options.length).toBe(3);
//     expect(genreDropdown.options[0].value).toBe('1');
//     expect(3,4).to
//     expect(genreDropdown.options[0].text).toBe('Action');
//     expect(genreDropdown.options[1].value).toBe('2');
//     expect(genreDropdown.options[1].text).toBe('Comedy');
//     expect(genreDropdown.options[2].value).toBe('3');
//     expect(genreDropdown.options[2].text).toBe('Drama');
//   });
//   // it('should make an XMLHttpRequest to get movie info', () => {
//   //   // Get the play button element
//     // const playButton = document.querySelector('#playbtn');

//   //   // Click the play button
//   //   playButton.click();

//   //   // Check if the XMLHttpRequest is called with the correct URL
//   //   expect(XMLHttpRequest).toHaveBeenCalledWith();
//   //   expect(XMLHttpRequest().open).toHaveBeenCalledWith(
//   //     'GET',
//   //     'https://api.themoviedb.org/3/discover/movie?api_key=c22aa0f213207dbeadf7ec9f7e41ef84&with_genres=1',
//   //     true
//   //   );
//   //   expect(XMLHttpRequest().send).toHaveBeenCalled();
//   // });

//   it('should display the movie info', () => {
//     // Mock the XMLHttpRequest response for movie info
//     global.XMLHttpRequest = jest.fn(() => ({
//       open: jest.fn(),
//       send: jest.fn(),
//       readyState: 4,
//       status: 200,
//       responseText: JSON.stringify({
//         poster_path: '/path/to/poster.jpg',
//         title: 'Movie Title',
//         overview: 'Movie Overview',
//       }),
//     }));

//     // Get the play button element
//     const playButton = document.querySelector('#playBtn')    

//     // Click the play button
//     playButton.click();

//     // Check if the movie info is displayed correctly
//     expect(document.querySelector('#moviePoster').getAttribute('src')).toBe(
//       'https://image.tmdb.org/t/p/original//path/to/poster.jpg'
//     );
//     expect(document.querySelector('#Movie Title')).toBeInTheDocument();
//     expect(document.querySelector('#Movie Overview')).toBeInTheDocument();
//   });
// });