import { useEffect, useState } from 'react'


const C1 = () => {
   const[counter,setCounter]= useState(20);
   const [isCompleted,setCompleted]=useState(false);
   function counterAdd() {
    setCounter(prevCounter => prevCounter + 1);
   }

   function counterMinus() {
    setCounter(prevCounter => prevCounter - 1);
   }
   async function fetchPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await response.json();
  console.log(posts);
}
   useEffect(()=>{
    fetchPosts();
   },[counter]);
   
  return (
    <div className='flex justify-around items-center bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-neutral-950 dark:text-slate-50'>
       <button className="py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer text-white border border-green-600 bg-green-600 hover:bg-green-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" onClick={counterAdd}>+1</button>
       <h3 className="text-xl font-semibold">{counter}</h3>
       <button className="py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer text-white border border-red-600 bg-red-600 hover:bg-red-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" onClick={counterMinus}>-1</button>
    </div>
  )
}

export default C1
