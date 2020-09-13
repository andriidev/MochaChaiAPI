function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
 }

export function nameGen(name: string) {
    let randomPart = randomInt(1, 99);
    let timeStamp = Date.now();
    let newName = name + "_" + randomPart + "_" + timeStamp;
    return newName;
}