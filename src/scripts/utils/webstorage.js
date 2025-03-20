const WebStorage = {
  get(key) {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  },
};

export default WebStorage; 