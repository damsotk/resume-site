import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShopHeader from './shop-header/shop-header';
import ShopFooter from './shop-footer/shop-footer'
import './shop.css';
import './shop-animation.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleClick = (productId) => {
    setAddedProducts(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className='mainPageShowLogicShop'>
      <ShopHeader onSearch={handleSearch} />
      <div className="background">
        {filteredProducts.length > 0 ? (
          <div className="shopAllProducts">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="shopProduct"
              >
                <div
                  onClick={() => handleClick(product.id)}
                  className={`icon ${addedProducts[product.id] ? 'checked' : 'plus'}`}
                ></div>
                <Link to={`/shop/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img style={{ position: 'relative' }} src={`http://localhost:3000${product.imageUrl}`} className="productImage" alt={product.name} />
                  <div className="productInfo">
                    <div className="productName">
                      {product.name}
                    </div>
                    <div className="productPrice">
                      ${product.price}
                    </div>
                  </div>
                </Link>
                <div className="buyButton">
                  <div className="buyButtonText old">Nice choice!</div>
                  <div className="buyButtonText new">Buy Now!</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='noProducts'>No products available, sorry bro</div>
        )}
      </div>
      <ShopFooter />
    </div>
  );
}

export default Shop;