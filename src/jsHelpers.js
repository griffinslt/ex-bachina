const pluck = (arr, key) => arr.map(i => i[key]);

const inlcudesArray = (needle, haystack) => {
    return JSON.stringify(haystack).includes(JSON.stringify(needle));
}

const indexOfArray = (needle, haystack) => {
    for (let i = 0; i < haystack.length; i++) {
        if (JSON.stringify(haystack[i]) == JSON.stringify(needle)) {
            return i;
        }
    }
    return null;
}

const randomise = (arr) => {
    return arr = arr.sort(() => 0.5 - Math.random());
}

export default { pluck, inlcudesArray, indexOfArray, randomise }
