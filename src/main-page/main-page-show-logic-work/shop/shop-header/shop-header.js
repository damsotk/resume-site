import './shop-header.css';
import { useState } from 'react';

function ShopHeader({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <div style={{ position: 'sticky', top: '0', zIndex: '3' }}>
            <div className="headerShop">
                <div className="logo">
                    DAMSOT
                </div>
                <div className="shopSearch">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="hm, i wanna..."
                    />
                    <div className="button" onClick={() => onSearch(searchQuery)}>Search</div>
                </div>
                <div className="shopUserInfo">
                    <div className="shopProfile"></div>
                    <div className="shopBasket"></div>
                </div>
            </div>
            <div className="marquee">
                <div className="marquee-inner">
                    <span>Where are born this sales, wtf?!</span>
                    <span>First purchase - free shipping!</span>
                    <span>I think you have good taste if you are here</span>
                </div>
            </div>
        </div>
    );
}

export default ShopHeader;