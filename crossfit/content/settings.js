// Define the SettingsStorageInterface
class SettingsStorageInterface {
  setItem(key, value, options) {
    throw new Error("Method 'setItem()' must be implemented.");
  }

  getItem(key) {
    throw new Error("Method 'getItem()' must be implemented.");
  }

  deleteItem(key) {
    throw new Error("Method 'deleteItem()' must be implemented.");
  }
}

// Implement CookieSettingsStorage
class CookieSettingsStorage extends SettingsStorageInterface {
  setItem(key, value, options = {}) {
    const days = options.days || 21;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${key}=${value}; ${expires}; path=/`;
  }

  getItem(key) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(key + "=") === 0) {
        return cookie.substring(key.length + 1);
      }
    }
    return null;
  }

  deleteItem(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

// Implement LocalStorageSettingsStorage
class LocalStorageSettingsStorage extends SettingsStorageInterface {
  setItem(key, value) {
    localStorage.setItem(key, value);
  }

  getItem(key) {
    return localStorage.getItem(key);
  }

  deleteItem(key) {
    localStorage.removeItem(key);
  }
}

// Define the main SettingsStorage class
class SettingsStorage {
  constructor(storageImplementation) {
    if (!(storageImplementation instanceof SettingsStorageInterface)) {
      throw new Error("Invalid storage implementation provided.");
    }
    this.storage = storageImplementation;
  }

  setItem(key, value, options) {
    this.storage.setItem(key, value, options);
  }

  getItem(key) {
    return this.storage.getItem(key);
  }

  deleteItem(key) {
    this.storage.deleteItem(key);
  }
}

// Define settings storage
 const useLocalStorage = true; // Set to false to use cookies
 const storageImplementation = useLocalStorage
   ? new LocalStorageSettingsStorage()
   : new CookieSettingsStorage();

 const settingsStorage = new SettingsStorage(storageImplementation);
