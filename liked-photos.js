document.addEventListener("DOMContentLoaded", function () {
  const likedPhotosContainer = document.querySelector(".liked-photos");

  function fetchPhotoDetails(photoId) {
    const accessKey = "srcQyQNIsAQ_0RH8TkTTRyIh8DpGcz1aW5ZafF7doko";
    const photoEndpoint = `https://api.unsplash.com/photos/${photoId}?client_id=${accessKey}`;

    return fetch(photoEndpoint)
      .then((response) => response.json())
      .catch((error) => console.error("Error fetching photo details:", error));
  }

  function displayLikedPhotos() {
    let likedPhotos = JSON.parse(localStorage.getItem("likedPhotos")) || [];

    likedPhotosContainer.innerHTML = "";

    likedPhotos.forEach((photoId) => {
      fetchPhotoDetails(photoId).then((photoData) => {
        const photoElement = createPhotoElement(photoData);

        likedPhotosContainer.appendChild(photoElement);
      });
    });
  }

  function createPhotoElement(photoData) {
    console.log("photo data:", photoData);
    const photoElement = document.createElement("div");
    photoElement.classList.add("photo");

    const imgElement = document.createElement("img");
    imgElement.src = photoData.urls.regular;
    imgElement.alt = photoData.alt_description || "Untitled";

    imgElement.addEventListener("click", () => {
      displayImageDetails(photoData);
    });

    photoElement.appendChild(imgElement);

    return photoElement;
  }

  function displayImageDetails(photoData) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    modalImage.src = photoData.urls.regular;

    const imageDetails = document.getElementById("imageDetails");
    imageDetails.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = photoData.alt_description || "Untitled";

    const author = document.createElement("p");
    author.textContent = `By: ${photoData.user.name}`;

    const likes = document.createElement("p");
    likes.textContent = `Likes: ${photoData.likes}`;

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download";
    downloadBtn.addEventListener("click", () => {
      downloadImage(photoData.urls.full);
    });

    const unlikeBtn = document.createElement("button");
    unlikeBtn.textContent = "Unlike";
    unlikeBtn.addEventListener("click", () => {
      unlikePhoto(photoData.id);
      modal.style.display = "none";
    });

    imageDetails.appendChild(title);
    imageDetails.appendChild(author);
    imageDetails.appendChild(likes);
    imageDetails.appendChild(downloadBtn);
    imageDetails.appendChild(unlikeBtn);

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

  function downloadImage(imageSrc) {
    const anchor = document.createElement("a");
    anchor.href = imageSrc;
    anchor.download = "image.jpg";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  function unlikePhoto(photoId) {
    let likedPhotos = JSON.parse(localStorage.getItem("likedPhotos")) || [];
    const index = likedPhotos.indexOf(photoId);
    if (index !== -1) {
      likedPhotos.splice(index, 1);
      localStorage.setItem("likedPhotos", JSON.stringify(likedPhotos));
      alert("Your like has been removed!");
      displayLikedPhotos();
    }
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
  displayLikedPhotos();
});
