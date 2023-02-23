import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const url = 'https://react-firebase-api-21ab1-default-rtdb.firebaseio.com/movies.json'

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);

      // const transformedMovies = Object.entries(data).map(([key, value]) => {
      //   return {
      //     id: key,
      //     title: value.title,
      //     openingText: value.openingText,
      //     releaseDate: value.releaseDate,
      //   }
      // })
       
      // setMovies(transformedMovies)

      //delete movie from firebase
      // const response = await fetch('https://react-firebase-api-21ab1-default-rtdb.firebaseio.com/movies/-MfZ5Z5Z5Z5Z5Z5Z5Z5Z.json', {
      //   method: 'DELETE',
      // });
      // const data = await response.json();
      // console.log(data);

    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
  }

  // const deleteMovieHandler = async (movieId) => {
  //   await fetch(`https://react-firebase-api-21ab1-default-rtdb.firebaseio.com/movies/${movieId}.json`, {
  //     method: 'DELETE',
  //   });
  //   const updatedMovies = movies.filter((movie) => movie.id !== movieId);
  //   setMovies(updatedMovies);
  // }



  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
