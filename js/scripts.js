const pokemonRepository = (function () {
  let pokemonList = [];

  pokemonList = [
    {
      name: "Bulbasaur",
      height: 0.7,
      types: ["grass", "poison"],
    },
    {
      name: "Venusaur",
      height: 2,
      types: ["grass", "poison"],
    },
    {
      name: "Chinchou",
      height: 0.5,
      types: ["electric", "water"],
    },
  ];

  const add = function (pokemon) {
    //error handling
    const keys = Object.keys(pokemon);
    if (keys[0] !== "name" || keys[1] !== "height" || keys[2] !== "types") {
      return console.log(
        "pokemon must be an object with keys name, height, types (array)"
      );
    }
    if (typeof pokemon !== "object" || typeof pokemon.types !== "object") {
      return console.log(
        "pokemon must be an object with keys name, height, types (array)"
      );
    }
    pokemonList.push(pokemon);
  };

  //search for a pokemon by name
  const find = function (name) {
    return pokemonList.filter(function (pokemon, name) {
      pokemon.name === name;
    });
  };

  //returns a list of all the pokemon
  const getAll = function () {
    return pokemonList;
  };

  // log a pokemon's name to the console
  const showDetails = function (pokemon) {
    console.log(pokemon.name);
  };

  //renders a pokemon object to the DOM
  const addListItem = function (pokemon) {
    const ulElement = document.querySelector(".pokemon-list");
    const listElement = document.createElement("li");
    const pokemonButton = document.createElement("button");

    pokemonButton.innerText = pokemon.name;
    pokemonButton.addEventListener("click", showDetails.bind(null, pokemon));

    pokemonButton.classList.add("pokemon");
    listElement.classList.add("pokemon-list__item");

    listElement.appendChild(pokemonButton);
    ulElement.appendChild(listElement);
  };

  return {
    getAll: getAll,
    add: add,
    find: find,
    addListItem: addListItem,
  };
})();

pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
