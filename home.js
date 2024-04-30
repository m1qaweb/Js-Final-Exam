document.addEventListener("DOMContentLoaded", function () {
  const accessKey = "srcQyQNIsAQ_0RH8TkTTRyIh8DpGcz1aW5ZafF7doko";
  const randomEndpoint = "https://api.unsplash.com/photos/random";
  const searchEndpoint = "https://api.unsplash.com/search/photos";
  const accessToken = "2UeMfvK_OEtMP51tqSIaJCWgPDPflMS-wvsMLAO7QpE";
  const perPage = 18;
  let selectedCategories = [];

  function searchImagesByCategory(categories, page = 1) {
    const query = categories.join(",");
    fetchImages(
      `${searchEndpoint}?client_id=${accessKey}&query=${query}&per_page=${perPage}&page=${page}`
    );
  }

  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", () => {
      const categoryValue = category.getAttribute("data-category");
      if (!selectedCategories.includes(categoryValue)) {
        if (selectedCategories.length < 3) {
          selectedCategories.push(categoryValue);
        } else {
          alert("You can select maximum 3 categories.");
        }
      } else {
        selectedCategories = selectedCategories.filter(
          (cat) => cat !== categoryValue
        );
      }
      toggleCategoryStyle(category, selectedCategories.includes(categoryValue));
      if (selectedCategories.length > 0) {
        searchImagesByCategory(selectedCategories);
      } else {
        fetchRandomImagesPerPage(1);
      }
    });
  });

  function toggleCategoryStyle(category, isSelected) {
    if (isSelected) {
      category.classList.add("selected-category");
    } else {
      category.classList.remove("selected-category");
    }
  }

  function searchImages(query, page = 1) {
    fetchImages(
      `${searchEndpoint}?client_id=${accessKey}&query=${query}&per_page=${perPage}&page=${page}`
    );
  }
  function fetchImages(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        displayImages(data.results);
        displayPagination(data.total_pages);
        attachEventListenersToCards();
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }

  function fetchRandomImage() {
    fetch(`${randomEndpoint}?client_id=${accessKey}`)
      .then((response) => response.json())
      .then((data) => {
        displayImages([data]);
        attachEventListenersToCards();
      })
      .catch((error) => {
        console.error("Error fetching random image:", error);
      });
  }

  function fetchRandomImages(startIndex, count) {
    fetch(
      `${randomEndpoint}?client_id=${accessKey}&count=${count}&start=${startIndex}`
    )
      .then((response) => response.json())
      .then((data) => {
        displayImages(data);
        attachEventListenersToCards();
      })
      .catch((error) => {
        console.error("Error fetching random images:", error);
      });
  }

  function displayImages(imagesData) {
    const imagesGrid = document.querySelector(".images-grid");
    imagesGrid.innerHTML = "";

    imagesData.forEach((imageData) => {
      const card = createCard(imageData);
      imagesGrid.appendChild(card);
    });
  }

  function createCard(imageData) {
    const card = document.createElement("div");
    card.classList.add("card");

    const imageElement = document.createElement("img");
    imageElement.src = imageData.urls.regular;
    imageElement.alt = "random image";
    imageElement.setAttribute("data-image-id", imageData.id);

    card.appendChild(imageElement);

    return card;
  }

  function displayPagination(totalPages) {
    const pagesDiv = document.querySelector(".pages");
    pagesDiv.innerHTML = "";

    for (let i = 1; i <= Math.min(totalPages, 15); i++) {
      const pageLink = document.createElement("a");
      pageLink.href = "#";
      pageLink.textContent = i;
      pageLink.addEventListener("click", () => {
        fetchImagesByPage(i);
      });

      pagesDiv.appendChild(pageLink);
    }
  }

  function fetchImagesByPage(page) {
    if (selectedCategories.length > 0) {
      searchImagesByCategory(selectedCategories, page);
    } else {
      fetchRandomImagesPerPage(page);
    }
  }

  function fetchRandomImagesPerPage(page) {
    const startIndex = (page - 1) * perPage + 1;
    fetchRandomImages(startIndex, perPage);
  }

  function attachEventListenersToCards() {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", (event) => {
        const imageId = event.target.getAttribute("data-image-id");

        displayImageDetails(imageId);
      });
    });
  }

  let currentPhotoId = null;

  function displayImageDetails(imageId) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    modalImage.src = `https://source.unsplash.com/${imageId}`;
    currentPhotoId = imageId;

    fetch(`https://api.unsplash.com/photos/${imageId}?client_id=${accessKey}`)
      .then((response) => response.json())
      .then((data) => {
        const imageDetails = document.getElementById("imageDetails");
        imageDetails.innerHTML = "";

        const title = document.createElement("h3");
        title.textContent = data.alt_description || "Untitled";
        const author = document.createElement("p");
        author.textContent = `By: ${data.user.name}`;
        const likes = document.createElement("p");
        likes.textContent = `Likes: ${data.likes}`;

        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download";
        downloadBtn.addEventListener("click", () => {
          downloadImage(data.urls.full);
        });
        const likeBtn = document.createElement("button");
        likeBtn.textContent = "Like";
        likeBtn.id = "img-like";
        likeBtn.addEventListener("click", () => {
          saveImageToLikePhotos(imageId);
        });

        imageDetails.appendChild(title);
        imageDetails.appendChild(author);
        imageDetails.appendChild(likes);
        imageDetails.appendChild(downloadBtn);
        imageDetails.appendChild(likeBtn);
      })
      .catch((error) => {
        console.error("Error fetching image details:", error);
      });

    modal.style.display = "block";
  }

  function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
  }

  document.querySelector(".close").addEventListener("click", () => {
    closeModal();
  });

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("imageModal");
    if (event.target === modal) {
      closeModal();
    }
  });

  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    searchImages(query);
  });

  document.getElementById("randomBtn").addEventListener("click", () => {
    fetchRandomImagesPerPage(1);
  });

  function downloadImage(imageSrc) {
    const anchor = document.createElement("a");
    anchor.href = imageSrc;
    anchor.download = "image.jpg";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  function saveImageToLikePhotos(imageId) {
    let likedPhotos = JSON.parse(localStorage.getItem("likedPhotos")) || [];

    if (!likedPhotos.includes(imageId)) {
      likedPhotos.push(imageId);
      localStorage.setItem("likedPhotos", JSON.stringify(likedPhotos));
      alert("You've Liked This Photo!");
    } else {
      alert(`Image with ID ${imageId} is already liked.`);
    }
  }

  fetchRandomImage();
});
