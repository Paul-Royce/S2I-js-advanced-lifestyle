"use strict";
import { get } from "lodash";
const inputCity = document.querySelector('#city-input');
const cityName = document.getElementById('city-name')
const ul = document.querySelector('ul');


setTimeout(() => { /* the purpose of this setTimeout is to make permanent the opacity after the animation has finished to work on ul, otherwise the rankings will appear and then disappear after the animation has finished */
    ul.style.opacity = 1;
}, 1500);

let errorCount = 0; /* this line is to count the amount of error output, to give the user some hint later in the error handling section */

// CALL THE TELEPORT API
async function giveOutput() {
    // clear all the childNodes in ul, they were there only as a placeholder, not showing any relevant data
    ul.innerHTML = "";
    let spinner = document.querySelector('.spinner-border');
    // SHOW THE SPINNER
    spinner.classList.toggle('hide');
    try {
        const response = await fetch(`https://api.teleport.org/api/urban_areas/slug:${inputCity.value}/scores/`);
        const result = await response.json();

        // show the value of the inputfield in the h2 in uppercase
        cityName.textContent = inputCity.value.toUpperCase(0);
        // create an array called data and put in all the scores results
        let data = get(result, "categories", "");
        data.forEach(element => {
            // create a list item to contain the title
            const list = document.createElement('li');
            // create the HTML element to host the title
            const title = document.createElement('h2');
            // set each element of the Array that has the key "name" has the textContent of the title 
            title.textContent = get(element, "name", "");
            // set each element of the Array that has the key "color" has the color of the title 
            title.style.color = get(element, "color", "");;
            // Nest eacch title variable inside the list variable
            list.append(title);
            // Nest each list variable inside the ul HTML element
            ul.append(list);
            // create a list container for the progress bar, then nest in it (using a shorthand methodology) the Bootstrap progress bar
            const progressBarContainer = document.createElement('li');
            progressBarContainer.innerHTML += `<div class="progress">
            <div class="progress-bar" role="progressbar" style="width:${get(element, "score_out_of_10", " ").toFixed(1) * 10 + '%'}" 
            aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">${get(element, "score_out_of_10", " ").toFixed(1) * 10 + '%'}</div>`;
            /* The idea is to have a percentage showing visually by the lenght of the filled progress bar, and also numericaly.
            All that is accomplished by doing some basic math to convert the api scores number into percentage numbers.*/
            ul.append(progressBarContainer)
        });

        // Change the rankings container background color to black
        const rankCtnr = document.querySelector('.rankings-ctnr');
        rankCtnr.style.backgroundColor = 'black';

        const summary = document.getElementById('summary');
        summary.innerHTML = get(result, "summary", "");
        spinner.classList.toggle('hide');
        // hoist up the function getImage
        getImage();
    } catch (e) { /* handle eventual errors */
        // create a paragraph that comunicates the user that something went wrong
        errorCount++;
        const errParagraph = document.createElement('h5');
        errorCount >= 2 ? errParagraph.textContent = 'If the name contains spaces try using - instead' : errParagraph.textContent = 'Something went wrong, try again...';
        errParagraph.style.color = 'red';
        errParagraph.style.textAlign = 'center';
        errParagraph.style.marginTop = '2rem';
        document.querySelector('.interaction-ctnr').append(errParagraph);
        // CHANGE THE IMAGE CONTAINER COLOR TO GREY
        document.getElementById('city-image').style.backgroundColor = 'grey';
        console.log(e);
    }
}

// CALL UNSPLASH API
async function getImage() {
    const imageContainer = document.getElementById('city-image');

    // loading spinner for the unsplash API
    let spinnerOne = document.querySelector('.spin-one');
    // show spinner 
    spinnerOne.classList.toggle('hide');

    const askData = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${inputCity.value}&client_id=${process.env.UNSPLASH_API_KEY}`);
    const returnedData = await askData.json();
    const fullImage = get(returnedData, "results[0].urls.full", "")
    imageContainer.style.backgroundImage = `url('${fullImage}')`;
    // hide spinner
    spinnerOne.classList.toggle('hide');
}

// EVENT LISTENERS
document.getElementById('button').addEventListener('click', giveOutput);
