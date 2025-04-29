const storage = {};
let view;
let primary;

/**
 * Retrieves a shallow copy of all key-value pairs from the in-memory store.
 * @returns {object} A plain object containing all stored keys and their values.
 */
export async function getAllData() {
  if (!view) {
    return {status: 503};
  }
  //Primary Decisions
  if (primary.id == process.env.NODE_IDENTIFIER) {
    return {status: 200, data: storage};
  }
  //Backup Decision
  else{
    try {
      const response = await fetch(`http://${primary.address}/data`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        return {status: response.status, data: data};
      } else {
        return {status: response.status};
      }
    } catch (err) {
      return {status: 500};
    }
  }
}

/**
 * Sets or updates a value for the given key in the store.
 * @param {string} key - The key to store.
 * @param {string} value - The string value to associate with the key.
 * @returns {boolean} True if the key already existed (updated) otherwise false
 */
export async function setData(key, value, isReplication = false) {
  if (!view) {
    return 503;
  }
  const myId = Number(process.env.NODE_IDENTIFIER);
  // Primary
  if (primary.id == process.env.NODE_IDENTIFIER) {
    const backupViews = view.filter(v => v.id !== myId).map(v => v.address);

    // Send replication requests to all backups
    let ok = true;
    for (const backup of backupViews) {
      try {
        const res = await fetch(`http://${backup}/data/${key}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            'X-Replication': 'true'
          },
          body: JSON.stringify({value})
        });

        ok = ok && res.ok;
      } catch (err) {
        ok = false;
      }
    }
    // Only update local storage if ALL replications succeeded
    if (ok) {
      const existed = storage[key] != null;
      storage[key] = value;
      return existed ? 200 : 201;
    } else {
      return 500;
    }
  }
  //Backup
  else {
    if (isReplication) {
      const existed = storage[key] != null;
      storage[key] = value;
      return existed ? 200 : 201;
    } else {
      // Normal client request, forward to primary
      try {
        const response = await fetch(`http://${primary.address}/data/${key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value})
        });
        return response.status;
      } catch (err) {
        return 500;
      }
    }
  }
}

/**
 * Retrieves the value associated with the given key from the store.
 * @param {string} key - The key to look up.
 * @returns {string | undefined} The stored string value if exists
 */
export async function getValue(key) {
  if (!view) {
    return {status: 503};
  }
  //Primary Decisions
  if (primary.id == process.env.NODE_IDENTIFIER) {
    return {status: storage[key] ? 200 : 404, data: storage[key]};
  }
  //Backup Decision
  else {
    try {
      const response = await fetch(`http://${primary.address}/data/${key}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        return {status: response.status, data: data.value};
      } else {
        return {status: response.status};
      }
    } catch (err) {
      return {status: 500};
    }
  }
}

/**
 * Deletes the specified key from the store.
 * @param {string} key - The key to delete.
 * @returns {boolean} True if exists false otherwise
 */
export async function delValue(key, isReplication = false) {
  if (!view) {
    return 503;
  }
  //Primary Decisions
  const myId = Number(process.env.NODE_IDENTIFIER);
  if (primary.id == process.env.NODE_IDENTIFIER) {
    const backupViews = view.filter(v => v.id !== myId).map(v => v.address);

    // Send replication requests to all backups
    let ok = true;
    for (const backup of backupViews) {
      try {
        const res = await fetch(`http://${backup}/data/${key}`, {
            method: 'DELETE',
            headers: {
              'X-Replication': 'true',
            },
          })
        ok = ok && (res.status == 200 || res.status == 404);
      } catch (err) {
        ok = false;
      }
    }
    // Only update local storage if ALL replications succeeded
    if (ok) {
      const existed = storage[key] != null;
      delete storage[key];
      return existed ? 200 : 404;
    } else {
      return 500;
    }
  }
  //Backup Decision
  else{
    if (isReplication) {
      const existed = storage[key] != null;
      delete storage[key];
      return existed ? 200 : 404;
    } else {
      try {
        const response = await fetch(`http://${primary.address}/data/${key}`, {
          method: 'DELETE'
        });
        return response.status;
      } catch (err) {
        return 500;
      }
    }
  }
}

/**
 * Replace the entire “view” array.
 * @param {Array<{id: string, address: string}>} newView
 */
export function setView(newView) {
  primary = newView.reduce(
    (min, v) => (v.id < min.id ? v : min),
    { id: Infinity, address: null }
  );
  view = newView;
}

