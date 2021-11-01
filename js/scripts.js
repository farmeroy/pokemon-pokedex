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

function printPokemonList(list) {
    
  for (let i = 0; i < list.length; i++) {
    const pokemon = list[i];
    // conditionally comment on the Pokemon's height using a ternary expression
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
}

printPokemonList(pokemonList)
