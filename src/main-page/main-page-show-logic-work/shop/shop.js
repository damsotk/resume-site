import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShopHeader from './shop-header/shop-header';
import ShopFooter from './shop-footer/shop-footer';
import './shop.css';
import './shop-animation.css';
import './responsive-styles-shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCost, setTotalCost] = useState(0.0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));

    fetch('http://localhost:3000/api/cart', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(cartItems => {
        const cartProductIds = {};
        let initialTotalCost = 0;

        cartItems.forEach(item => {
          cartProductIds[item.id] = true;
          initialTotalCost += parseFloat(item.price);
        });

        setAddedProducts(cartProductIds);
        setTotalCost(initialTotalCost);
      })
      .catch(error => console.error('Error fetching cart items:', error));
  }, []);

  const removeProductFromCart = async (productId) => {
    try {
      const response = await fetch('http://localhost:3000/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId }),
      });
  
      if (!response.ok) {
        throw new Error(`Помилка при видаленні товару з корзини: ${response.statusText}`);
      }
      console.log('Товар успішно видалено з кошика');
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const handleClick = (product) => {
    const productId = product.id;
    const productPrice = parseFloat(product.price);
    const isAdded = !addedProducts[productId];
  
    const newTotalCost = isAdded ? totalCost + productPrice : totalCost - productPrice;
  
    if (isAdded) {
      saveProductToCart(productId); 
    } else {
      removeProductFromCart(productId); 
    }
  
    setAddedProducts(prevState => ({
      ...prevState,
      [productId]: isAdded,
    }));
  
    setTotalCost(newTotalCost);
  };
  
  const saveProductToCart = async (productId) => {
    try {
      const response = await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`Помилка при додаванні товару до корзини: ${response.statusText}`);
      }
      console.log('Товар успішно додано до корзини');
    } catch (error) {
      console.error('Error saving product:', error);
    }
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
      <ShopHeader onSearch={handleSearch} totalCost={totalCost}  />
      <div className='containerForBalls'></div>
      <div className="background">
        {filteredProducts.length > 0 ? (
          <div className="shopAllProducts">
            {filteredProducts.map(product => (
              <div key={product.id} className="shopProduct">
                <div onClick={() => handleClick(product)} className={`icon ${addedProducts[product.id] ? 'checked' : 'plus'}`}></div>
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
