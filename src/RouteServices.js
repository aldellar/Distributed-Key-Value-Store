const storage = {};
let view = [];
let primary = false;
// Filling with some standard data
storage['andrew'] = 'dellaringa';
storage['ajar'] = 'dahal';
storage['joseph'] = 'dellaringa';
storage['barbara'] = 'mancuso';
storage['mandy'] = 'cliburn';
storage['caitlynn'] = 'davis';
storage['matt'] = 'cliburn';

/**
 * Retrieves a shallow copy of all key-value pairs from the in-memory store.
 * @returns {object} A plain object containing all stored keys and their values.
 */
export function getAllData() {
  return storage;
}

/**
 * Sets or updates a value for the given key in the store.
 * @param {string} key - The key to store.
 * @param {string} value - The string value to associate with the key.
 * @returns {boolean} True if the key already existed (updated) otherwise false
 */
export function setData(key, value) {
  if (storage[key] == null) {
    storage[key] = value;
    return false;
  }
  storage[key] = value;
  return true;
}
/**
 * Retrieves the value associated with the given key from the store.
 * @param {string} key - The key to look up.
 * @returns {string | undefined} The stored string value if exists
 */
export function getValue(key) {
  return storage[key];
}
/**
 * Deletes the specified key from the store.
 * @param {string} key - The key to delete.
 * @returns {boolean} True if exists false otherwise
 */
export function delValue(key) {
  if (storage[key] == null) {
    return false;
  }
  delete storage[key];
  return true;
}
/**
 * Replace the entire “view” array.
 * @param {Array<{id: string, address: string}>} newView
 */
export function setView(newView) {
  if (view.length == 0) {
    let min = Infinity;
    for (let i in newView) {
      if (newView[i].id < min) min = newView[i].id;
    }
    if (min == process.env.NODE_IDENTIFIER) primary = true;
  }
  view = newView;
}
