import './shop-header.css';
import { useState } from 'react';

function ShopHeader({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <div style={{ position: 'sticky', top: '20px', zIndex: '3' }}>
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
            </div>
        </div>
    );
}

export default ShopHeader;