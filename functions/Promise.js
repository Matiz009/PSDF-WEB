// // Creating a Promise
// const myPromise = new Promise(testFun);


// function testFun(resolve, reject){
//   const success = true;
//   if (success) {
//     resolve("✅ Operation worked!");  // Fulfilled
//   } else {
//     reject("❌ Something went wrong");  // Rejected
//   }
// }
// // Consuming a Promise
// myPromise
//   .then(result => console.log(result))   // "✅ Operation worked!"
//   .catch(error => console.log(error))   // Only runs on rejection
//   .finally(() => console.log("Done!"));  // Always runs


async function fetchData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/2");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
}
}

fetchData();