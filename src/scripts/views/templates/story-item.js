const createStoryItemTemplate = (story) => `
  <div class="story-item">
    <a href="#/detail/${story.id}" class="story-item__link">
      <div class="story-item__thumbnail-container">
        <img class="story-item__thumbnail" src="${story.photoUrl}" alt="${story.name}">
      </div>
      <div class="story-item__content">
        <div class="story-item__meta">
          <div class="story-item__author">
            <img class="story-item__author-avatar" 
                 src="https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}" 
                 alt="${story.name}">
            <div class="story-item__author-info">
              <h3 class="story-item__author-name">${story.name}</h3>
              <p class="story-item__date">${new Date(story.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
`;

export default createStoryItemTemplate; 