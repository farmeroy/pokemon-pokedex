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


for (let i=0; i<pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    let comment = pokemon.height > 1 ? '<span class="pokemon__comment">Wow! That is BIG!!!</span>' : ''; 
    document.write(`<p class="pokemon__name">${pokemon.name} ${comment}</p>`);
}