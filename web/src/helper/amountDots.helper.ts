export const addDotsToMoney = (amount : number) => {
    let str : string = "";
    let count: number = 0
    while(amount > 0){
        str += (amount % 10).toString();
        amount = Math.floor(amount / 10);
        if(count === 2)str += '.';
        count = (count + 1) % 3;
    }
    return str.split('').reverse().join('');
}