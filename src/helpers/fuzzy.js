function fuzzySearch(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function capitalNames(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

module.exports = { fuzzySearch, capitalNames }