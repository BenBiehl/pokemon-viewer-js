// Variables
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("submit-button");
const searchResults = document.getElementById("search-results");
const pokemonImage = document.getElementById("pokemon-image");
let allPokemonNames = [];

// Functions
async function fetchNames() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=100000'
  );
  const data = await response.json();

  return data.results.map(pokemon => pokemon.name);
}

async function fetchPokemonData(name) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
  );

  const data = await response.json();

  return data.sprites.front_default;
}

async function init() {
  allPokemonNames = await fetchNames();
}

function renderResults(matches) {
  searchResults.innerHTML = "";

  if (matches.length === 0) {
    searchResults.style.display = "none";
    return;
  }

  matches.forEach(name => {
    const div = document.createElement("div");

    div.classList.add("result-item");
    div.textContent = name;

    div.addEventListener("click", () => {
      searchInput.value = name;
      searchResults.style.display = "none";
    });

    searchResults.appendChild(div);
  });

  searchResults.style.display = "block";
}

// Event Listeners
searchButton.addEventListener('click', async () => {
  pokemonImage.src = await fetchPokemonData(searchInput.value);
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  if (!query) {
    searchResults.style.display = "none";
    return;
  }

  const matches = allPokemonNames
    .filter(name => name.startsWith(query))
    .slice(0, 5);

  renderResults(matches);
});

init();
