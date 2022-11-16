import { GiConsoleController } from "react-icons/gi"

export function parseListedNfts(array) {
    var listedNfts = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i][1] != "0x0000000000000000000000000000000000000000") {
            listedNfts.push(array[i])
        }
        
    }
    var sortedNfts = sortAscending(listedNfts)
    return sortedNfts
}

export function sortAscending(array) {
    const sortedData = array.sort((a, b) => a.price.toString() - b.price.toString())
    return sortedData
}

export function sortDescending(array) {
    const sortedData = array.sort((a, b) => b.price.toString() - a.price.toString())
    return sortedData
}