import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { jwtDecode } from 'jwt-decode';
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
import ExchangeHoldings from './main-page/main-page-show-logic-work/exchange/exchangeHoldings/exchangeHoldings';
import ExchangeTransactions from './main-page/main-page-show-logic-work/exchange/exchangeTransactions/exchangeTransactions';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, [token]);

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

          <Route path='/exchange/portfolio' element={
            <ProtectedRoute token={token}>
              <ExchangeHoldings />
            </ProtectedRoute>
          } />

          <Route path='/exchange/transactions' element={
            <ProtectedRoute token={token}>
              <ExchangeTransactions />
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
