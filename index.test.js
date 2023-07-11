require('text-encoding').TextEncoder;
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
// import fetchMock from 'fetch-mock';
// import axios from 'axios';

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom;
let document;
let window;

const XMLHttpReq = jest.fn(() => ({
  open: jest.fn(),
  send: jest.fn(),
  readyState: 4,
  status: 200,
  responseText: JSON.stringify({
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
      { id: 3, name: 'Drama' },
    ],
  }),
}));


// let open, send, onload, onerror;

// function createXHRmock() {
//   const open = jest.fn();

//   // Be aware we use *function* because we need to get *this*
//   // from *new XMLHttpRequest()* call
//   const send = jest.fn().mockImplementation(function() {
//       this.onload = this.onload.bind(this);
//       this.onerror = this.onerror.bind(this);
//   });

//   const xhrMockClass = function () {
//       return {
//           open,
//           send,
//           responseText: JSON.stringify({
//                 genres: [
//                   { id: 1, name: 'Action' },
//                   { id: 2, name: 'Comedy' },
//                   { id: 3, name: 'Drama' },
//                 ],
//               }),
//       };
//   };

//   window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
// }
window.XMLHttpRequest = jest.fn().mockImplementation(XMLHttpReq);
describe("The final output has been printed correctly", () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
    window = dom.window;
  });
  it('should populate the genre dropdown', () => {
    // createXHRmock();
    // Get the genre dropdown element
    // const genreDropdown = getByTestId(document.body, 'genres');
    const genreDropdown = document.querySelector('#genres');

    // Check if the dropdown options are populated correctly
    expect(genreDropdown.options.length).toBe(3);
    expect(genreDropdown.options[0].value).toBe('1');
    expect(genreDropdown.options[0].text).toBe('Action');
    expect(genreDropdown.options[1].value).toBe('2');
    expect(genreDropdown.options[1].text).toBe('Comedy');
    expect(genreDropdown.options[2].value).toBe('3');
    expect(genreDropdown.options[2].text).toBe('Drama');
  });
  // it('should make an XMLHttpRequest to get movie info', () => {
  //   // Get the play button element
    // const playButton = document.querySelector('#playbtn');

  //   // Click the play button
  //   playButton.click();

  //   // Check if the XMLHttpRequest is called with the correct URL
  //   expect(XMLHttpRequest).toHaveBeenCalledWith();
  //   expect(XMLHttpRequest().open).toHaveBeenCalledWith(
  //     'GET',
  //     'https://api.themoviedb.org/3/discover/movie?api_key=c22aa0f213207dbeadf7ec9f7e41ef84&with_genres=1',
  //     true
  //   );
  //   expect(XMLHttpRequest().send).toHaveBeenCalled();
  // });

  it('should display the movie info', () => {
    // Mock the XMLHttpRequest response for movie info
    global.XMLHttpRequest = jest.fn(() => ({
      open: jest.fn(),
      send: jest.fn(),
      readyState: 4,
      status: 200,
      responseText: JSON.stringify({
        poster_path: '/path/to/poster.jpg',
        title: 'Movie Title',
        overview: 'Movie Overview',
      }),
    }));

    // Get the play button element
    const playButton = document.querySelector('#playBtn')    

    // Click the play button
    playButton.click();

    // Check if the movie info is displayed correctly
    expect(document.querySelector('#moviePoster').getAttribute('src')).toBe(
      'https://image.tmdb.org/t/p/original//path/to/poster.jpg'
    );
    expect(document.querySelector('#Movie Title')).toBeInTheDocument();
    expect(document.querySelector('#Movie Overview')).toBeInTheDocument();
  });
});