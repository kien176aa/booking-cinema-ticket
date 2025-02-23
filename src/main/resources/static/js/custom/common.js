
function addFirstAndDeleteLast(id, newItem, arr, pageSize = 10) {
    arr.unshift(newItem);

    if (arr.length >= pageSize) {
        arr.pop();
    }
    // console.log('arr: ', $(id), arr);
    // const firstRow = arr[0];
    // const lastRow = arr[arr.length - 1];
    // console.log('fRow: ', firstRow);
    // console.log('lRow: ', lastRow);
    // $(id).replaceWith(renderFunc(firstRow));
    // if (arr.length > 1) {
    //     $(id).replaceWith(renderFunc(lastRow));
    // }
}