// Variables
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("submit-button");
const searchResults = document.getElementById("search-results");

const pokemonContainer = document.getElementById("pokemon-container");
const pokemonImage = document.getElementById("pokemon-image");

const shinyButton = document.getElementById("shiny-button");
const pokemonName = document.getElementById("pokemon-name");
const pokemonID = document.getElementById("pokemon-id");
const pokemonHeight = document.getElementById("pokemon-height");
const pokemonWeight = document.getElementById("pokemon-weight");
const pokemonTypes = document.getElementById("pokemon-types");

let allPokemonNames = [];
let currentPokemon = null;
let isShiny = false;

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

  return data;
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
  currentPokemon = await fetchPokemonData(searchInput.value);
  pokemonContainer.style.display = "flex";

  isShiny = false;
  searchInput.value = "";

  pokemonImage.src = currentPokemon.sprites.front_default;
  pokemonName.textContent = currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1);
  pokemonID.textContent = currentPokemon.id;
  pokemonHeight.textContent = currentPokemon.height;
  pokemonWeight.textContent = currentPokemon.weight;
  pokemonTypes.textContent = currentPokemon.types
    .map(type => type.type.name)
    .join(", ");
});

searchInput.addEventListener('input', () => {
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

shinyButton.addEventListener('click', () => {
  if (!currentPokemon) return;

  isShiny = !isShiny;

  if (!isShiny) {
    shinyButton.textContent = "Shiny Form";
    pokemonImage.src = currentPokemon.sprites.front_default;
  } else {
    shinyButton.textContent = "Normal Form";
    pokemonImage.src = currentPokemon.sprites.front_shiny;
  }
});

init();
