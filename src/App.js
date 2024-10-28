
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './main-page/main-page'
import MovieSearch from './main-page/main-page-show-logic-work/movie-search/movie-search'
import ToDoList from './main-page/main-page-show-logic-work/to-do-list/to-do-list'
import WeeklyPlanner from './main-page/main-page-show-logic-work/to-do-list/weekly-planner/weekly-planner'
import CompletedAffairs from './main-page/main-page-show-logic-work/to-do-list/completed-affairs/completed-affairs'

function App() {
  return (
    <Router>
      <div className='BOSS'>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/movie-searcher" element={<MovieSearch />} />
          <Route path="/to-do-list" element={<ToDoList />} />
          <Route path="/to-do-list/weekly-planner" element={<WeeklyPlanner />} />
          <Route path="/to-do-list/completed-affairs" element={<CompletedAffairs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


