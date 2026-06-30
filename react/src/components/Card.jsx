const Card = ({id,title,body}) => {
  return (
    <div>
        <div
   className="h-full bg-white border border-slate-200 shadow-sm w-full rounded-lg p-4 sm:p-6 transition-colors dark:bg-neutral-800 dark:border-neutral-700">
   <div>
      <h3 className="text-slate-900 text-base font-semibold dark:text-slate-50">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed dark:text-slate-400">{body}</p>
   </div>
   <a href="#"
      className="inline-block mt-6 py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      {id}
   </a>
</div>
    </div>
  )
}

export default Card
