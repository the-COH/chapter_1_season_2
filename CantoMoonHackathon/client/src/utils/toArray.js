export function toArray(input) {
    const arr = [];

    for(const i in input) {
        arr.push(input[i].toString());
    }

    return arr
}