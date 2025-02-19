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

const indexOfItemInElement = (arr, item) => {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.includes(item)) {
            return i;
        }
    }
    return -1;
}

export default { pluck, inlcudesArray, indexOfArray, randomise, indexOfItemInElement }
