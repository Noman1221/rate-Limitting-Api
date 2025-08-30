let n = 98727;
let reversed = 0;


while (n > 0) {
    let getLastDigit = n % 10;
    reversed = reversed * 10 + getLastDigit;
    n = Math.floor(n / 10);
};
console.log(reversed);
