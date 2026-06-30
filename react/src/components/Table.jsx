const Table = ({ users = [] }) => {
  return (
    <div className="overflow-x-auto px-4 md:px-8 py-10 bg-slate-50 transition-colors dark:bg-neutral-950">
      <table className="w-full max-w-7xl mx-auto border-collapse">
        <thead className="border-b border-slate-300 text-left text-sm font-semibold text-slate-700 whitespace-nowrap dark:border-neutral-700 dark:text-slate-200">
          <tr>
            <th scope="col" className="pl-0 px-3 py-3.5">Name</th>
            <th scope="col" className="px-3 py-3.5">Email</th>
            <th scope="col" className="px-3 py-3.5">Title (Company)</th>
            <th scope="col" className="px-3 py-3.5">Role</th>
            <th scope="col" className="pr-0 px-3 py-3.5">Actions</th>
          </tr>
        </thead>

        <tbody className="text-sm divide-y divide-slate-200 dark:divide-neutral-800">
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-slate-100 dark:hover:bg-neutral-900">
              <td className="pl-0 px-3 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-slate-50">
                {user.name}
              </td>
              <td className="px-3 py-4 text-slate-500 dark:text-slate-400">
                {user.email}
              </td>
              <td className="px-3 py-4 text-slate-500 dark:text-slate-400">
                {user.company?.name || "N/A"}
              </td>
              <td className="px-3 py-4 text-slate-500 dark:text-slate-400">
                {user.id === 1 ? "Admin" : "Member"}
              </td>
              <td className="pr-0 px-3 py-4 flex gap-3">
                <button
                  type="button"
                  className="text-sm text-blue-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded dark:text-blue-400"
                  aria-label={`Edit ${user.name}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-sm text-red-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded dark:text-red-400"
                  aria-label={`Delete ${user.name}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
