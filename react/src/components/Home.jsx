import { useEffect, useState } from "react";
import Card from "./Card";
import posts from '../assets/posts.json';
import users from '../assets/users.json';
import Header from "./Header";
import Footer from "./Footer";
import Table from "./Table";
import Hero from "./Hero";

function Home() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const isDarkMode = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", theme);
  }, [theme, isDarkMode]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-slate-50">
    <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme}/>
   
    <Hero/>
      <section className="px-4 md:px-8 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card 
              key={post.id} // Always provide a unique key at the top level of mapped items
              title={post.title} 
              body={post.body} 
              id={post.id} 
            />
          ))}
        </div>
      </section>
      <Table users={users}/>
      <Footer/>
    </div>
  );
}

export default Home;
