import Card from "./components/Card";
import posts from './assets/posts.json';
import users from './assets/users.json';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Table from "./components/Table";
import Hero from "./components/Hero";
function App() {
  console.log(posts);
  
  return (
    <>
    <Header/>
    <Hero/>
      {posts.map((post) => (
        <Card 
          key={post.id} // Always provide a unique key at the top level of mapped items
          title={post.title} 
          body={post.body} 
          id={post.id} 
        />
      ))}
      <Table users={users}/>
      <Footer/>
    </>
  );
}

export default App;