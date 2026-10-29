/**
 * UI 状态的 LocalStorage 存取。
 */
export const memory = {
    get(key) {
        const value = window.localStorage.getItem(key);
        return value == null ? null : JSON.parse(value);
    },
    set(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },
    remove(key) {
        window.localStorage.removeItem(key);
    }
};
