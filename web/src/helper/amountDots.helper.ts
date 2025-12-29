export const addDotsToMoney = (amount : number) => {
    if(amount === 0) return 0;
    let str : string = "";
    let count: number = 0
    while(amount > 0){
        str += (amount % 10).toString();
        amount = Math.floor(amount / 10);
        if(count === 2 && amount > 0)str += '.';
        count = (count + 1) % 3;
    }
    return str.split('').reverse().join('');
}