//// PRACTICE

// maximum value
let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

// minimum value
movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const min = movements.reduce((acc, mov) => {
  if (acc < mov) return acc;
  else return mov;
}, movements[0]);
console.log(min);

// Find function
const account = accounts.find(acc => acc.owner === 'Sarah Smith');
console.log(account);

// Includes
console.log(movements.includes(-130));

// some
console.log(movements.some(acc => acc > 0));
console.log(movements.some(acc => acc === -130));

// every
console.log(account4.movements.every(acc => acc > 0));

// flat
let arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

let arrDeep = [[[1, 2], 3, 4], 5, 6, [[7, 8], 9]];
console.log(arrDeep.flat(2));

const overAllBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);

const overAllBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overAllBalance2);

// sort
console.log(movements);
console.log(movements.sort((a, b) => a - b));

// Fill and From
arr = [1, 2, 3, 4, 5, 6, 7];

// Empty array + fill method
const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));    Doesn't works
x.fill(5, 2, 5);
console.log(x);

arr.fill(25, 2, 4);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 3);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementUI);
});
