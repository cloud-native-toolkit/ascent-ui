module.exports = {
    encode: (str) => {
        return btoa(encodeURIComponent(str))
    },

    decode: (str) => {
        return decodeURIComponent(atob(str))
    }
}
