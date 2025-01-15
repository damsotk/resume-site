import { useNavigate, useLocation } from 'react-router-dom';
import './exchangeMenu.css';

const ExchangeMenu = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    // Handle navigation
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="exchangeMenu">
            <div 
                className={`exchangeMenuButton ${location.pathname === '/exchange' ? 'exchangeMenuButtonactive' : ''}`} 
                onClick={() => handleNavigation('/exchange')}
            >
                Main Page
            </div>
            <div 
                className={`exchangeMenuButton ${location.pathname === '/exchange/portfolio' ? 'exchangeMenuButtonactive' : ''}`} 
                onClick={() => handleNavigation('/exchange/portfolio')}
            >
                View Portfolio
            </div>
            <div 
                className={`exchangeMenuButton ${location.pathname === '/exchange/transactions' ? 'exchangeMenuButtonactive' : ''}`} 
                onClick={() => handleNavigation('/exchange/transactions')}
            >
                Your Transactions
            </div>
        </div>
    );
};

export default ExchangeMenu;