import './shop-header.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function ShopHeader({ onSearch, totalCost, importNameForHeader }) {
    const location = useLocation();


    const isProductPage = location.pathname.startsWith('/shop/product');

    if (isProductPage) {
        return (
            <div style={{ position: 'sticky', top: '10px', zIndex: '11', marginBottom: '20px' }}>
                <div className="headerShopProductDetails">
                    <Link
                        to={`/shop`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className="buttonBack">
                            BACK
                        </div>
                    </Link>
                    <div className='nameForSelectProduct'>
                        {importNameForHeader}
                    </div>
                    <div className='productSocialHeader'>
                        <img src={`http://localhost:3000/images/instagram.png`} alt="instagram" />
                        <img src={`http://localhost:3000/images/facebook.png`} alt="facebook" />
                        <img src={`http://localhost:3000/images/twitter.png`} alt="twitter" />
                        <img src={`http://localhost:3000/images/youtube.png`} alt="youtube" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'sticky', top: '20px', zIndex: '15' }}>
            <div className="headerShop">
                <div className="logo">DAMSOT</div>
                <div className="shopAllCost">${totalCost.toFixed(2)}</div>
            </div>
        </div>
    );
}

export default ShopHeader;