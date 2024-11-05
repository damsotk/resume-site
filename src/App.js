import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import MainPage from './main-page/main-page';
import MovieSearch from './main-page/main-page-show-logic-work/movie-search/movie-search';
import ToDoList from './main-page/main-page-show-logic-work/to-do-list/to-do-list';
import LeapToRiches from './main-page/main-page-show-logic-work/leap-to-riches/leap-to-riches';
import ShopAreaLeapToRiches from './main-page/main-page-show-logic-work/leap-to-riches/shop-area-leap-to-riches/shop-area-leap-to-riches';
import AllCompaniesLeapToRiches from './main-page/main-page-show-logic-work/leap-to-riches/all-companies-leap-to-riches/all-companies-leap-to-riches';
import WeeklyPlanner from './main-page/main-page-show-logic-work/to-do-list/weekly-planner/weekly-planner';
import CompletedAffairs from './main-page/main-page-show-logic-work/to-do-list/completed-affairs/completed-affairs';
import Shop from './main-page/main-page-show-logic-work/shop/shop';
import ProductDetails from './main-page/main-page-show-logic-work/shop/product-details/product-details';
import Login from './main-page/login/login';
import ProtectedRoute from './main-page/login/protected-route/ProtectedRoute'; // Імпортуємо ProtectedRoute

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
          {/* Маршрут для входу */}
          <Route path="/login" element={<Login setToken={handleToken} />} />

          {/* Захищені маршрути */}
          <Route path="/" element={

            <MainPage />

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
          <Route path='/leap-to-riches' element={
            <ProtectedRoute token={token}>
              <LeapToRiches />
            </ProtectedRoute>
          } />
          <Route path='/leap-to-riches/shop-area' element={
            <ProtectedRoute token={token}>
              <ShopAreaLeapToRiches />
            </ProtectedRoute>
          } />
          <Route path='/leap-to-riches/all-companies' element={
            <ProtectedRoute token={token}>
              <AllCompaniesLeapToRiches />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
