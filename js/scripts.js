// a simple function to capitalize the Pokemon names
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// IIFE containing the modal logic
const modalTemplate = (function () {
  // hide modal function
  function hideModal() {
    let modalContainer = document.getElementById("modal-container");
    modalContainer.classList.remove("is-visible");
  }

  // show modal function, is returned by the IIFE
  function showModal(title, text, imageUrl, id, nextModal, prevModal) {
    let modalContainer = document.getElementById("modal-container");
    // clear existing modal content
    modalContainer.innerHTML = "";
    // write new content
    let modal = document.createElement("div");
    modal.classList.add("modal");
    let closeBtn = document.createElement("button");
    closeBtn.classList.add("modal-close");
    closeBtn.innerText = "Close";
    closeBtn.addEventListener("click", hideModal);

    let titleElement = document.createElement("h1");
    titleElement.innerText = title;

    let contentElement = document.createElement("p");
    contentElement.innerText = text;

    let placeHolderDiv = document.createElement("div");
    placeHolderDiv.classList.add('place-holder');

    modal.appendChild(closeBtn);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modal.appendChild(placeHolderDiv);
    modalContainer.appendChild(modal);
    modal.focus();

    // render the image conditionally -- it would be nice to add a placeholder img instead
    if (imageUrl) {
      modal.removeChild(placeHolderDiv);
      let imageElement = document.createElement("img");
      imageElement.src = imageUrl;
      modal.appendChild(imageElement);
    }
    // allow for scrolling through the next and previous pokemons, but not if the modal is just a loading message
    if (typeof id === "number") {
      const btnContainer = document.createElement('div');
      btnContainer.classList.add('prev-next-btn-container');
      const nextBtn = document.createElement('button');
      const prevBtn = document.createElement('button');
      nextBtn.innerText = 'Next =>';
      prevBtn.innerText = '<= Previous';
      nextBtn.addEventListener("click", nextModal.bind(null, id));
      prevBtn.addEventListener('click', prevModal.bind(null, id));
      modal.appendChild(btnContainer);
      btnContainer.appendChild(prevBtn);
      btnContainer.appendChild(nextBtn);
    }

    modalContainer.classList.add("is-visible");
    modalContainer.addEventListener("click", (e) => {
      // Since this is also triggered when clicking INSIDE the modal
      // We only want to close if the user clicks directly on the overlay
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
    // make the modal accessable to the keyboard
    window.addEventListener("keydown", (e) => {
      let modalContainer = document.getElementById("modal-container");
      if (
        e.key === "Escape" &&
        modalContainer.classList.contains("is-visible")
      ) {
        hideModal();
      }
    });
  }
  return {
    showModal: showModal,
  };
})();

// creates and renders the pokemon list
const pokemonRepository = (function () {
  let pokemonList = [];
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  const add = function (pokemon) {
    //error handling must be updated
    pokemonList.push(pokemon);
  };

  //search for a pokemon by name
  const find = function (name) {
    return pokemonList.filter(function (pokemon) {
      return pokemon.name.toLowerCase() === name.toLowerCase();
    });
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
    pokemonButton.addEventListener("click", showDetails.bind(null, pokemon));

    pokemonButton.classList.add("btn")
    pokemonButton.classList.add("btn-outline-primary");
    pokemonButton.classList.add("btn-block")
    listElement.classList.add("list-item");


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
    // show a loading modal; this prevents multiple clicks and improves UI
    modalTemplate.showModal(
      "Loading...",
      "Finding your pokemon...",
      null,
      null
    );
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

  const getNextPokemon = function (currId) {
    if (currId + 1 < pokemonList.length) {
      showDetails(pokemonList[currId + 1]);
    } else {
      showDetails(pokemonList[0]);
    }
  };
  const getPreviousPokemon = function (currId) {
    if (currId - 1 > -1) {
      showDetails(pokemonList[currId - 1]);
    } else {
      showDetails(pokemonList[pokemonList.length - 1]);
    }
  };

  // loadsDetails and renders the pokemon to the modal element
  const showDetails = function (pokemon) {
    loadDetails(pokemon).then(function () {
      // show the details in the modal
      modalTemplate.showModal(
        pokemon.name,
        `Height: ${pokemon.height}m`,
        pokemon.imageUrl,
        pokemon.id,
        getNextPokemon,
        getPreviousPokemon
      );
    });
  };

  return {
    getAll: getAll,
    add: add,
    find: find,
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
