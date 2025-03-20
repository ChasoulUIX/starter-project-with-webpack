const createMapPopupTemplate = (story) => `
  <div class="map-popup">
    <img src="${story.photoUrl}" alt="${story.description}" class="map-popup__image">
    <div class="map-popup__content">
      <h4>${story.name}</h4>
      <p>${story.description}</p>
      <small>${new Date(story.createdAt).toLocaleDateString()}</small>
    </div>
  </div>
`;

export default createMapPopupTemplate; 