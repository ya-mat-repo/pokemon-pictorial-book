import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';
import { getAllPokemon, getPokemon } from './utils/pokemon';

function App() {
  const initialURL = 'https://pokeapi.co/api/v2/pokemon';
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [prevURL, setPrevURL] = useState('');
  const [nextURL, setNextURL] = useState('');

  useEffect(() => {
    const fetchPokemonData = async () => {
      let res = await getAllPokemon(initialURL);
      setNextURL(res.next);
      loadPokemon(res.results);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      }),
    );
    setPokemonData(_pokemonData);
  };

  const handlePrevPage = async () => {
    setLoading(true);
    if (prevURL) {
      let data = await getAllPokemon(prevURL);
      await loadPokemon(data.results);
      setPrevURL(data.previous);
      setNextURL(data.next);
    }
    setLoading(false);
  };
  const handleNextPage = async () => {
    setLoading(true);
    if (nextURL) {
      let data = await getAllPokemon(nextURL);
      await loadPokemon(data.results);
      setPrevURL(data.previous);
      setNextURL(data.next);
    }
    setLoading(false);
  };

  // console.log(pokemonData);

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
