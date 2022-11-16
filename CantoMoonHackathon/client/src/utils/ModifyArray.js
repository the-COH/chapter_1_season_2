export function modifyArray(arr, newId) {
    const id = newId;
    if(!arr.includes(id)){          //checking weather array contain the id
        arr.push(id);               //adding to array because value doesnt exists
    }else{
        arr.splice(arr.indexOf(id), 1);  //deleting
        console.log('deleting from array')
    }
    console.log(arr);
    return arr
}