// require('text-encoding').TextEncoder;
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path, { resolve } from "path";
require("iconv-lite").encodingExists('foo');
const html = fs.readFileSync(path.resolve(__dirname, "./index.html")).toString();


let dom;
let document;
let window;
describe("testing the api",()=>{
  beforeEach(()=>{
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
    window = dom.window;
  })
  afterEach(()=>{
    document.innerHTML = "";
  })


  test('Genre options are populated correctly', async () => {
    // Check if the genre form exists
    const genreForm = document.getElementById('genreForm');
    expect(genreForm).toBeInTheDocument();

    await new Promise((resolve) => {
      const genreOptions = document.querySelectorAll('option'); 
      resolve()
      expect(genreOptions.length).toBe(19);

  });
});
  
    test("clicking on the search button new movie should be displayed",async ()=>{
      const movieinfo = await document.querySelector('#moviePoster');
      expect(movieinfo.children.length).toBe(0);
      const btn = document.querySelector('#playBtn');
      btn.click(); 
      const value = new Promise((resolve) => 
        resolve(document.querySelector('#moviePoster'))
     );
    value.then((element)=>{
      console.log(element);
      expect(element.children.length).not.toBe(0);

    })
 }
    
 )

    // test("clicking on the search button new movie should be displayed", async () => {
    //   const movieinfo = document.querySelector('#moviePoster');
    //   expect(movieinfo.children.length).toBe(0);
    
    //   const btn = document.querySelector('#playBtn');
    
    //   // Create a promise for the click event
    //   const clickPromise = new Promise((resolve) => {
    //     btn.addEventListener('click', () => resolve(), { once: true });
    //     btn.click();
    //   });
    
    //   // Wait for the promise to be resolved
    //   await clickPromise;
    
    //   const updatedmovieinfo = document.querySelector('#moviePoster');
    //   expect(updatedmovieinfo.children.length).not.toBe(0);
    // });
    
    
    
    
    
    // test('Clicking on the "Next" button changes the movie', async () => {
    //   const movieinfo = await document.querySelector('#moviePoster');
    //   expect(movieinfo.children.length).toBe(0);
    //   const btn = document.querySelector('#playBtn');
    //   btn.click(); 
    //   await new Promise((resolve) => {
    //     const updatedmovieinfo = document.querySelector('#moviePoster');
    //     resolve()
    //     expect(movieinfo.children.length).not.toBe(0);
    //     console.log(movieinfo.children[0].textContent);
    // });
    // });
})