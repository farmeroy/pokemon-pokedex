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
    if (
      typeof pokemon !== Object ||
      Object.keys(pokemon) !== ["name", "height", "types"] ||
      typeof pokemon.types !== Array
    ) {
      return console.log(
        "pokemon must be an object with keys name, height, types (array)"
      );
    }

    pokemonList.push(pokemon);
  };

  const find = function (name) {
    return pokemonList.filter(function (pokemon, name) {
      pokemon.name === name;
    });
  };

  const getAll = function () {
    return pokemonList;
  };

  return {
    getAll: getAll,
    add: add,
    find: find,
  };
})();


function printPokemon(pokemon) {
 
  let comment =
    pokemon.height > 1
      ? '<p class="pokemon__comment">Wow! That is BIG!!!</p>'
      : "";

  document.write(
    `<div class="pokemon">
            <h1>${pokemon.name}</h1>
            <p class="pokemon__value">Height: ${pokemon.height}m</p>
            ${comment}
        </div>`
  );
}

pokemonRepository.getAll().forEach(printPokemon);
