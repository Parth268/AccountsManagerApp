import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageUtils = {
  /**
   * Save data to AsyncStorage.
   * @param {string} key - The key to store the data under.
   * @param {any} value - The value to store (will be stringified).
   * @returns {Promise<boolean>} - Returns true if the operation is successful.
   */
  async saveData(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
      return false;
    }
  },

  /**
   * Retrieve data from AsyncStorage.
   * @param {string} key - The key of the data to retrieve.
   * @returns {Promise<any|null>} - The parsed value or null if not found.
   */
  async getData(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
      return null;
    }
  },

  /**
   * Remove data from AsyncStorage.
   * @param {string} key - The key of the data to remove.
   * @returns {Promise<boolean>} - Returns true if the operation is successful.
   */
  async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data from AsyncStorage:', error);
      return false;
    }
  },

  /**
   * Clear all data from AsyncStorage.
   * @returns {Promise<boolean>} - Returns true if the operation is successful.
   */
  async clearAllData() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      return false;
    }
  },
};

export default AsyncStorageUtils;
