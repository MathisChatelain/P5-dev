import instance from './axios_instance.js';

async function fetchMovies(category, overrideParams=null){
  // We only to fetch the seven most popular movie of a category
  // category should be a capitalized string
  let params = overrideParams || {
    genre: category, 
    sort_by: "-imdb_score", 
    page_size: 7
  };
  let response = await instance.get("v1/titles/", { params: params });
  let data = response.data;
  return data;
}

async function fetchMovieDataById(id){
  let response = await instance.get(`v1/titles/${id}`);
  let data = response.data;
  return data;
}

function setMostPopularMovie(data){
  let mostPopularMovie = data.results[0];
  document.getElementById("main").innerHTML = `
    <section class="most-popular-movie-section">
      <article id="most-popular-movie">
        <div>
          <h2 id="mpm-title"></h2>
          <button id="mpm-button">Play</button>
        </div>
        <img id="mpm-image" src="" alt="Most popular movie image">
      </article>
    </section>
  `;
  document.getElementById("mpm-title").innerHTML = mostPopularMovie.title;
  document.getElementById("mpm-image").src = mostPopularMovie.image_url;
  document.getElementById("most-popular-movie").addEventListener("click", () => {
    addMovieModal(mostPopularMovie);
  });
};

function addMovieToCategory(parent_element, image_url="", id){
  let item = document.createElement("li");
  let img = document.createElement("img");
  img.src = image_url;
  item.appendChild(img);
  item.classList.add("slide");
  item.addEventListener("click", () => {
    fetchMovieDataById(id).then((data) => {
      addMovieModal(data);
    });
  });
  parent_element.appendChild(item);
}

function addCategoryToDom(category, data){
  let main_dom_element = document.getElementById("main");
  
  //<section class="slider-wrapper"></section>
  let section = document.createElement("section");
  section.classList.add("slider-wrapper");

  //<h2 id="category-title">Category</h2>
  let h2 = document.createElement("h2");
  h2.classList.add("category-title")
  h2.id = category + "-title";
  h2.innerText = category;
  main_dom_element.appendChild(h2);

  //<button class="slide-arrow" id="slide-arrow-prev">&#8249;</button>
  let button_prev = document.createElement("button");
  button_prev.classList.add("slide-arrow");
  button_prev.id = "slide-arrow-prev";
  button_prev.innerHTML = "&#8249;";
  section.appendChild(button_prev);

  //<ul class="slides-container"></ul>
  let ul = document.createElement("ul");
  ul.classList.add("slides-container");
  const slideWidth = 250;

  button_prev.addEventListener("click", () => {
    ul.scrollLeft -= slideWidth;
  });
  section.appendChild(ul);

  for(let i = 0; i < data.results.length; i++){
    let image_url = data.results[i].image_url;
    addMovieToCategory(ul, image_url, data.results[i].id);
  }

  //   <button class="slide-arrow" id="slide-arrow-next">&#8250;</button>
  let button_next = document.createElement("button");
  button_next.classList.add("slide-arrow");
  button_next.id = "slide-arrow-next";
  button_next.innerHTML = "&#8250;";
  section.appendChild(button_next);

  button_next.addEventListener("click", (event) => {
      ul.scrollLeft += slideWidth;
  });
  main_dom_element.appendChild(section);
}

function addMovieModal(data){
  //This function adds a modal to the DOM
  // It should show the movie details and allow to be closed
  // elem is the element that triggers the modal
  // data is the data of the movie to be displayed
  let modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = "modal" + data.id;
  modal.innerHTML =
    `<table class="modal-content">
      <tr>
        <td class="modal-img-container">
          <img src="${data.image_url}" alt="${data.title}">
        </td>
        <td>
          <h3>Titre: ${data.title}</h3>
          <p>Genres: ${data.genres}</p>
          <p>Date de sortie: ${data.date_published}</p>
          <p>Note: ${data.rated}</p>
          <p>Score ImDb: ${data.imdb_score}</p>
          <p>Réalisateurs: ${data.directors}</p>
          <p>Acteurs: ${data.actors}</p>
          <p>Durée: ${data.duration} min</p>
          <p>Pays: ${data.countries}</p>
          <p>Résultat au Box Office: ${data.worldwide_gross_income} $</p>
          <p>Budget: ${data.budget} $</p>
          <p>Resumé: ${data.description}</p>
        </td>
      </tr>
    </table>
    `;
  let body = document.getElementsByTagName("body")[0];
  body.appendChild(modal);
  body.addEventListener("click", (event) => {
    if(event.target == modal){
      removeMovieModal(data);
    }
  });
}

function removeMovieModal(data) {
  let modal = document.getElementById("modal" + data.id);
  modal.remove();
}

let mostPopularMoviesData = await fetchMovies("Films les plus populaires", {sort_by: "-imdb_score", page_size: 7});
setMostPopularMovie(mostPopularMoviesData)
addCategoryToDom("Films les plus populaires", mostPopularMoviesData);
addCategoryToDom("Romance", await fetchMovies("Romance"));
addCategoryToDom("Biography", await fetchMovies("Biography"));
addCategoryToDom("Crime", await fetchMovies("Crime"));