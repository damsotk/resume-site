
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './main-page/main-page'
import MovieSearch from './main-page/main-page-show-logic-work/movie-search/movie-search'

function App() {
  return (
    <Router>
      <div className='BOSS'>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/movie-searcher" element={<MovieSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


