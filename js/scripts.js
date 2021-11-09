// a simple function to capitalize the Pokemon names
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


// creates and renders the pokemon list
const pokemonRepository = (function () {
  let pokemonList = [];
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  const add = function (pokemon) {
    //error handling must be updated
    pokemonList.push(pokemon);
  };

  //search for a pokemon by name
  const searchBtnHandler = function (event) {
    event.preventDefault()
      const modalBody = document.querySelector(".modal-body");
      modalBody.innerText = "";
    const searchEl = document.getElementById('search-field');
    const query = searchEl.value;
    const searchResult = pokemonList.find( ({ name }) => name === toTitleCase(query));
    const modal = document.getElementById("pokemon-details");
    if (searchResult) {
      console.log(searchResult.id)
      $('#pokemon-details').modal("show");
      showDetails(pokemonList[searchResult.id])
    } else {
      // add error handling
      $("#pokemon-details").modal("show");
      const modalTitle = modal.querySelector('.modal-title');
      modalTitle.innerText = `Can't find a pokemon named ${query}`;
    }
    //clear the search field
    searchEl.value = '';
  };

  //returns a list of all the pokemon
  const getAll = function () {
    return pokemonList;
  };

  //renders a pokemon object to the DOM
  const addListItem = function (pokemon) {
    const ulElement = document.getElementById("pokemon-list");
    const listElement = document.createElement("li");
    const pokemonButton = document.createElement("button");

    pokemonButton.innerText = pokemon.name;
    // Style the pokemon button
    pokemonButton.classList.add(
      "btn",
      "btn-outline-primary",
      "btn-block",
      "list-group-item",
      "list-group-item-action",
      "m-1",
      "pokemon-btn"
    );
    // set up modal btn functionality
    pokemonButton.setAttribute("data-toggle", "modal");
    pokemonButton.setAttribute("data-target", "#pokemon-details");
    pokemonButton.addEventListener("click", showDetails.bind(null, pokemon));

    listElement.appendChild(pokemonButton);
    ulElement.appendChild(listElement);
  };

  const showLoadingMsg = function () {
    const mainEl = document.querySelector("main");
    const loadingMsgEl = document.createElement("h2");
    loadingMsgEl.classList.add("loading-msg");
    loadingMsgEl.textContent = "Loading pokemon content...";
    mainEl.appendChild(loadingMsgEl);
  };

  const hideLoadingMsg = function () {
    const mainEl = document.querySelector("main");
    const loadingMsgEl = document.querySelector(".loading-msg");
    mainEl.removeChild(loadingMsgEl);
  };

  // fetch the pokemon list from the API
  const loadList = function () {
    showLoadingMsg();
    return (
      fetch(apiUrl)
        .then(function (response) {
          hideLoadingMsg();
          return response.json();
        })
        // loop through the response and add each item to the repository
        .then(function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: toTitleCase(item.name),
              detailsUrl: item.url,
            };
            add(pokemon);
            // add an id property that is equivelant to the index of the pokemon
            pokemon.id = pokemonList.indexOf(pokemon);
          });
        })
        .catch(function (e) {
          hideLoadingMsg();
          console.error(e);
        })
    );
  };

  // access the details of the specific pokemon, called in showDetails

  const loadDetails = function (item) {
    const modalTitle = document.querySelector(".modal-title");
    // show a loading modal; this prevents multiple clicks and improves UI
    modalTitle.innerText = "Loading...";
    // clear the previous modal
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerText = "Searching for your pokemon...";
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        // access the relevant details from the JSON response
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  };


  // next pokemon
  const getNextPokemon = function () {
    const modal = document.querySelector('.modal-content');
    const currId = +modal.dataset.pokemonIndex;
    if (currId + 1 < pokemonList.length) {
      showDetails(pokemonList[currId + 1]);
    } else {
      showDetails(pokemonList[0]);
    }
  };

  // previous pokemon
  const getPreviousPokemon = function () {
        const modal = document.querySelector(".modal-content");
        const currId = +modal.dataset.pokemonIndex;
    if (currId - 1 > -1) {
      showDetails(pokemonList[currId - 1]);
    } else {
      showDetails(pokemonList[pokemonList.length - 1]);
    }
  };

  // loadsDetails and renders the pokemon to the modal element
  const showDetails = function (pokemon) {
    loadDetails(pokemon).then(function () {
      // access the modal element
      const modal = document.querySelector(".modal-content");
      modal.setAttribute("data-pokemon-index", pokemon.id);
      const modalBody = document.querySelector(".modal-body");
      // clear the loadign dialog
      modalBody.innerText = "";
      // name the pokemon
      const modalTitle = modal.querySelector(".modal-title");
      modalTitle.innerText = pokemon.name;
      // set the image
      const pokemonImage = document.createElement("img");
      pokemonImage.setAttribute("src", pokemon.imageUrl);
      pokemonImage.classList.add('mx-auto', 'mw-100')
      modalBody.appendChild(pokemonImage);
      // pokemone deatail text
      const modalText = document.createElement("p");
      modalText.innerText = `Height: ${pokemon.height}m`;
      modalBody.appendChild(modalText);
    });
  };

  // add btn functionality
  const nextBtn = document.getElementById("next-btn");
  nextBtn.addEventListener("click", getNextPokemon);

  const prevBtn = document.getElementById("prev-btn");
  prevBtn.addEventListener("click", getPreviousPokemon);

  const searchBtn = document.getElementById("pokemon-search");
  searchBtn.addEventListener('submit', searchBtnHandler)

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

// innitiate the app
pokemonRepository.loadList().then(function () {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
