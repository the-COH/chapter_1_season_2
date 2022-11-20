export function isConnected(id) {
    if(id == '0x1e14') {
        console.log('is connected', id)
        return true
    } else {
        console.log('Incorrect chain ID:', id)
        return false
    }
};