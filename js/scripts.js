const modalTemplate = (function () {
  function hideModal() {
    let modalContainer = document.getElementById("modal-container");
    modalContainer.classList.remove("is-visible");
  }

  function showModal(title, text, imageUrl) {
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
    
    let imageElement = document.createElement("img");
    imageElement.src = imageUrl;

    modal.appendChild(closeBtn);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modal.appendChild(imageElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add("is-visible");
    modalContainer.addEventListener("click", (e) => {
      // Since this is also triggered when clicking INSIDE the modal
      // We only want to close if the user clicks directly on the overlay
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });

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

  const loadList = function () {
    showLoadingMsg();
    return fetch(apiUrl)
      .then(function (response) {
        hideLoadingMsg();
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        hideLoadingMsg();
        console.error(e);
      });
  };

  // access the details of the specific pokemon, called in showDetails
  const loadDetails = function (item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  };

  // log a pokemon's name to the console
  const showDetails = function (pokemon) {
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
      // show the details in the modal
      modalTemplate.showModal(pokemon.name, `Height: ${pokemon.height}`, pokemon.imageUrl);
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

pokemonRepository.loadList().then(function () {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
