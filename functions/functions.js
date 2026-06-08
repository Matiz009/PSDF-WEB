




// // // // let c=test(5,10);
// // // // console.log(c);


// // // //function(a,b){
// // // //     let c = a + b;
// // // //     return c;
// // // // }


// // // var a = 10;

// // // console.log(a);

// // // var a = 20;

// // // console.log(a);

// // // // let b = 10;

// // // // console.log(b);


// // // // b = 20;

// // // // console.log(b);


// // // // const c = 10;

// // // // console.log(c);

// // // // c = 20;

// // // // console.log(c);



// // console.log(w);


// // let w = 10;

// // console.log(w);


// // // var w;
// // // console.log(w);

// // // w = 10;

// // // console.log(w);


// //arrow function

// // let printSomething = () => console.log("Hello World");

// // printSomething();


// // function calSquare(n){
// //     return n*n;
// // }

// // console.log(calSquare(7));


// // let calSquare2 = n => n-n;

// // console.log(calSquare2(9));


// let printSquare=function(n)
// {
//     console.log(n*n);
// };


// let printSomeThing = function(n){
//     console.log(n);
// }
// let print1SomeThing = function(n){
//     console.log(n+1);
// }

// let printOne = function(n){
//     console.log(1);
// }


// function HighOrderFunction(a,b,callback){
//    callback(a*a+b);
// }

// HighOrderFunction(4,5,printOne);


let nums = [1,2,3,4,5];


let squares = nums.forEach((n)=>{
    console.log(n);
})


let squaresUsingMap = nums.map((n)=>{
    console.log(n*n);;
});

console.log(squares);
console.log(squaresUsingMap);

console.log(typeof squares);
console.log(typeof squaresUsingMap);