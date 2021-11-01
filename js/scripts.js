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

for (let i = 0; i < pokemonList.length; i++) {
  const pokemon = pokemonList[i];
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
