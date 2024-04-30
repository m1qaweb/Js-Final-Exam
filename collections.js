document.addEventListener("DOMContentLoaded", function () {
  const myCollectionsContainer = document.querySelector(".my-collections");

  function displayCollections() {
    let collections = JSON.parse(localStorage.getItem("collections")) || [];

    myCollectionsContainer.innerHTML = "";

    collections.forEach((collection) => {
      const collectionElement = createCollectionElement(collection);
      myCollectionsContainer.appendChild(collectionElement);

      if (collection.title) {
        searchImageByTitle(collection.title, collectionElement);
      }
    });
  }

  function createCollectionElement(collection) {
    const collectionElement = document.createElement("div");
    collectionElement.classList.add("collection");

    const titleElement = document.createElement("h3");
    titleElement.textContent = collection.title;

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = collection.description || "No description";

    const imageElement = document.createElement("img");
    imageElement.classList.add("collection-image");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      deleteCollection(collection);
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      openEditCollection(collection);
    });

    collectionElement.appendChild(imageElement);
    collectionElement.appendChild(titleElement);
    collectionElement.appendChild(descriptionElement);
    collectionElement.appendChild(editButton);
    collectionElement.appendChild(deleteButton);

    return collectionElement;
  }

  function deleteCollection(collection) {
    let collections = JSON.parse(localStorage.getItem("collections")) || [];
    collections = collections.filter((c) => c.id !== collection.id);
    localStorage.setItem("collections", JSON.stringify(collections));
    displayCollections();
  }

  function searchImageByTitle(title, collectionElement) {
    const accessKey = "srcQyQNIsAQ_0RH8TkTTRyIh8DpGcz1aW5ZafF7doko";
    const timestamp = Date.now();
    const searchEndpoint = `https://api.unsplash.com/search/photos?query=${title}&client_id=${accessKey}&per_page=30&timestamp=${timestamp}`;

    fetch(searchEndpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to search images: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const imageUrl = data.results[randomIndex].urls.regular;
          const imageElement =
            collectionElement.querySelector(".collection-image");
          imageElement.src = imageUrl;
        }
      })
      .catch((error) => {
        console.error("Error searching images:", error);
      });
  }

  function createCollection(title, description, isPrivate) {
    const accessToken = "2UeMfvK_OEtMP51tqSIaJCWgPDPflMS-wvsMLAO7QpE";
    const createCollectionEndpoint = "https://api.unsplash.com/collections";

    const requestBody = JSON.stringify({
      title: title,
      description: description,
      private: isPrivate,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: requestBody,
    };

    fetch(createCollectionEndpoint, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to create collection: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Collection created successfully:", data);

        let collections = JSON.parse(localStorage.getItem("collections")) || [];
        collections.push(data);
        localStorage.setItem("collections", JSON.stringify(collections));

        displayCollections();
        alert("Collection created successfully!");
      })
      .catch((error) => {
        console.error("Error creating collection:", error);
        alert("Failed to create collection. Please try again later.");
      });
  }

  function openEditCollection(collection) {
    editingCollection = collection;

    const modal = document.getElementById("editCollection");
    const titleInput = document.getElementById("editCollectionTitle");
    const descriptionInput = document.getElementById(
      "editCollectionDescription"
    );
    const editForm = document.getElementById("editCollectionForm");

    titleInput.value = collection.title;
    descriptionInput.value = collection.description || "";

    modal.style.display = "block";

    editForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const editedTitle = titleInput.value.trim();
      const editedDescription = descriptionInput.value.trim();

      updateCollectionDetails(editedTitle, editedDescription);

      modal.style.display = "none";
    });
    function closeModal() {
      const modal = document.getElementById("editCollection");
      modal.style.display = "none";
    }

    document.querySelector(".close").addEventListener("click", () => {
      closeModal();
    });

    window.addEventListener("click", (event) => {
      const modal = document.getElementById("editCollection");
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  function updateCollectionDetails(title, description) {
    const collections = JSON.parse(localStorage.getItem("collections")) || [];
    const index = collections.findIndex(
      (collection) => collection.id === editingCollection.id
    );

    if (index !== -1) {
      collections[index].title = title;
      collections[index].description = description;

      localStorage.setItem("collections", JSON.stringify(collections));

      displayCollections();
    }
  }

  const newCollectionForm = document.getElementById("newCollectionForm");
  newCollectionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const collectionTitleInput = document.getElementById("collectionTitle");
    const collectionDescriptionInput = document.getElementById(
      "collectionDescription"
    );
    const collectionTitle = collectionTitleInput.value.trim();
    const collectionDescription = collectionDescriptionInput.value.trim();

    if (collectionTitle) {
      createCollection(collectionTitle, collectionDescription);
    } else {
      alert("Please enter a title for the new collection.");
    }

    collectionTitleInput.value = "";
    collectionDescriptionInput.value = "";
  });

  displayCollections();
});
