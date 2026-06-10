
// function accessVariable(n) {
//     let count = 0; // This variable is enclosed by the inner function
//     function increment() {
//         count=count + 100;
//         return count;
//     }
//     return increment;
// }


// const counter = accessVariable();

// console.log(counter()); // Output: 100


// function fetchData(url, onSuccess,onError) {
//   // simulate async
  
// setTimeout(() => onSuccess("data received"), 1000);
// if(error){
//     onError("error occurred");
// }
// }

// fetchData("api/user", onSuccess);


// function onSuccess(data) {
//     console.log("Success:", data);
// }


//iife functions


// (function() {
//     console.log("This is an IIFE function");
// })();


function factorial(n) {
  
if (n === 0) return 1;  // base case
  
return n * factorial(n - 1);  // recursive call
}


console.log(factorial(5)); // Output: 120