
/*
 寻找三个连续相同的元素
*/
export function findConsecutiveTriples(array, condition = (x, y) => x == y) {
    let result: any = [];

    //检查横向连续且元素值相同的三个元素
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length - 2; j++) {
            if (condition(array[i][j], array[i][j + 1]) && condition(array[i][j], array[i][j + 2])) {
                let tripletH = [array[i][j], array[i][j + 1], array[i][j + 2]];
                result.push(tripletH);
            }
        }
    }

    //检查竖向连续且元素值相同的三个元素
    for (let j = 0; j < array[0].length; j++) { // 这里我们假设所有子数组长度相同
        for (let i = 0; i < array.length - 2; i++) {
            if (condition(array[i][j], array[i + 1][j]) && condition(array[i][j], array[i + 2][j])) {
                let tripletV = [array[i][j], array[i + 1][j], array[i + 2][j]];
                result.push(tripletV);
            }
        }
    }

    return result;
}

