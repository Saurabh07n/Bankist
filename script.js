'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Mark Berg',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const tableHeader = document.querySelector('.table-header');

const btnCloseModal = document.querySelector('.close-modal');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnUsageGuide = document.querySelector('.usage-guide');
const btnLogout = document.querySelector('.logout-img');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

window.addEventListener('beforeunload',() => {
  window.scrollTo(0,0);
});

// Display user accounts in usage guide
const displayUsageGuide = () => {
  let html = ``;
  
  accounts.forEach((acc) => {
    const username = acc.owner.toLowerCase().split(' ').map(user => user[0]).join('');
    html += `
        <tr>
          <td>${acc.owner}</td>
          <td>'${username}'</td>
          <td>' ${acc.pin} '</td>
        </tr>
    `;
  });
  tableHeader.insertAdjacentHTML('afterend',html);
};

displayUsageGuide();

// Display transactions //
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// display net balance //
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// Summary
const calcDisplaySummary = function (acc) {
  const movements = acc.movements;
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcome = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Creating usernames //
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  displayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

const postLogin = (acc) => {
  // display UI message
  labelWelcome.textContent = `Welcome ${acc.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;

  // clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
};

const updateUIonLoad = () => {
  let account = localStorage.getItem('account');
  if(account) {
    account = JSON.parse(account);
    postLogin(account);
    updateUI(account);
  }
};
updateUIonLoad();

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const timer = () => {
  let count = 300;

  const formatNum = (num) => {
    num = num.toString();
    if(num.length === 1) return `0${num}`;
    else return `${num}`
  };
  
  // WORK IN PROGRESS
  const test = () => {
    if(count) setTimeout(()=>{
    count--;
    console.log(count);
    const text = `${formatNum(count/60)}:${formatNum(count%60)}`;
    labelTimer.insertAdjacentText('afterbegin',text);
    test();
    },1000);
    else return;
  }
  test();
};

let currentAccount;

// Implementing Usage Guide
btnUsageGuide.addEventListener('click', function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Implementing Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevents from submitting
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    postLogin(currentAccount);
    updateUI(currentAccount);
    localStorage.setItem('account',JSON.stringify(currentAccount));
    timer();
  }
});

// Implementing Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

// loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(acc => acc >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Delete');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// sorting movements

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted);
});

// logout
btnLogout.addEventListener('click',() => {
  localStorage.clear();
  location.reload();
  window.scrollTo(0,0);
});
