// I am going to talk about JavaScript.
// Why JavaScript:
//  Because It is the language of the web. and If you are doing anything related to FrontEnd 
// or Full-Stack, you need to know how JavaScript works. And Now with NodeJS, JavaScript
// is also a great tool for back-end development.

// We will talk about JavaScript array or you can call them list. I am going to talk about some 
// functions that we can call on an Array.

// Functions/methods that we are going to learn now
// forEach  useCase:- If you want to do something with each element., return: void
// Reduce   useCase:- If you want to do some operation on each element in a continuous manner, like addition
// Filter   useCase:- Filtering some values from the array. like values which are greater than 5
// Find   returns the frist value that finds true on given value or else none found then returns undefined
// map     doing something on each element and returning that array as a result.

let numberArray = [1, 3, 5, 8];

let evenNumberArray = numberArray.filter((element) => element % 2 !== 0);


console.log(evenNumberArray);
