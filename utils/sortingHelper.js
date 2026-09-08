function isAscending(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    return JSON.stringify(arr) === JSON.stringify(sorted);
}

function isDescending(arr) {
    const sorted = [...arr].sort((a, b) => b - a);
    return JSON.stringify(arr) === JSON.stringify(sorted);
}

function isAscendingStrings(arr) {
    const sorted = [...arr].sort((a, b) => a.localeCompare(b));
    return JSON.stringify(arr) === JSON.stringify(sorted);
}

function isDescendingStrings(arr) {
    const sorted = [...arr].sort((a, b) => b.localeCompare(a));
    return JSON.stringify(arr) === JSON.stringify(sorted);
}

module.exports = {
    isAscending,
    isDescending,
    isAscendingStrings,
    isDescendingStrings
};