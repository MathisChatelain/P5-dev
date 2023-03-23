const instance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 10000,
  headers: { 
    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
  },
});

async function fetchMovies(){
  let response = await instance.get("v1/titles/");
  let data = response.data;
  return data
};

async function fetchMostPopularMovie(){
  let response = await instance.get("v1/titles/", {params: {sort_by: "-imdb_score"}});
  let data = response.data;
  return data;
};

async function fetchMovieBycategory(category){
  // We oly to fetch the seven most popular movie of a category
  // category should be a capitalized string
  let response = await instance.get("v1/titles/", {
    params: {
      genre: category, 
      sort_by: "-imdb_score", 
      page_size: 7
    }
  });
  let data = response.data;
  return data;
}

function setMostPopularMovie(data){
  let mostPopularMovie = data.results[0];
  let mostPopularMovieTitle = mostPopularMovie.title;
  let mostPopularMovieImageUrl = mostPopularMovie.image_url;

  let dom_element_mpm = document.getElementById("most-popular-movie");

  let dom_mpm_title = document.getElementById("mpm-title");
  dom_mpm_title.innerHTML = mostPopularMovieTitle;

  let dom_mpm_image = document.getElementById("mpm-image");
  dom_mpm_image.src = mostPopularMovieImageUrl;

};

function addMovieToCategory(parent_element, image_url=""){
  let item = document.createElement("li");
  let img = document.createElement("img");
  img.src = image_url;
  item.appendChild(img);
  item.classList.add("slide");
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
    addMovieToCategory(ul, image_url);
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

fetchMovies();
let mpmData = await fetchMostPopularMovie();
setMostPopularMovie(mpmData)

addCategoryToDom("Romance", await fetchMovieBycategory("Romance"));
addCategoryToDom("Biography", await fetchMovieBycategory("Biography"));
addCategoryToDom("Crime", await fetchMovieBycategory("Crime"));