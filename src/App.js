import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import MainPage from './main-page/main-page';
import MovieSearch from './main-page/main-page-show-logic-work/movie-search/movie-search';
import ToDoList from './main-page/main-page-show-logic-work/to-do-list/to-do-list';
import WeeklyPlanner from './main-page/main-page-show-logic-work/to-do-list/weekly-planner/weekly-planner';
import CompletedAffairs from './main-page/main-page-show-logic-work/to-do-list/completed-affairs/completed-affairs';
import Shop from './main-page/main-page-show-logic-work/shop/shop';
import ProductDetails from './main-page/main-page-show-logic-work/shop/product-details/product-details';
import Login from './main-page/login/login';
import ProtectedRoute from './main-page/login/protected-route/ProtectedRoute';
import Messanger from './main-page/main-page-show-logic-work/messanger/messanger';
import Exchange from './main-page/main-page-show-logic-work/exchange/exchange';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <Router>
      <div className='BOSS'>
        <Routes>
          <Route path="/login" element={<Login setToken={handleToken} />} />


          <Route path="/" element={
            <MainPage />
          } />

          <Route path='/exchange' element={
            <ProtectedRoute token={token}>
              <Exchange />
            </ProtectedRoute>
          } />

          <Route path="/movie-searcher" element={
            <ProtectedRoute token={token}>
              <MovieSearch />
            </ProtectedRoute>
          } />
          <Route path='/to-do-list' element={
            <ProtectedRoute token={token}>
              <ToDoList />
            </ProtectedRoute>
          } />
          <Route path='/to-do-list/weekly-planner' element={
            <ProtectedRoute token={token}>
              <WeeklyPlanner />
            </ProtectedRoute>
          } />
          <Route path="/to-do-list/completed-affairs" element={
            <ProtectedRoute token={token}>
              <CompletedAffairs />
            </ProtectedRoute>
          } />
          <Route path="/shop" element={
            <ProtectedRoute token={token}>
              <Shop />
            </ProtectedRoute>
          } />
          <Route path="/shop/products/:id" element={
            <ProtectedRoute token={token}>
              <ProductDetails />
            </ProtectedRoute>
          } />
          <Route path="/messanger" element={
            <ProtectedRoute token={token}>
              <Messanger />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
