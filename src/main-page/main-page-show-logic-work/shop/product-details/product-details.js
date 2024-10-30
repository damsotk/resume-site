import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ShopHeader from '../shop-header/shop-header';
import './product-details.css'
import { color } from 'chart.js/helpers';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product details:', error));
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className='backgroundShop'>
      <ShopHeader />
      <div className='productDetailsFlex'>
        <img src={`http://localhost:3000${product.imageUrl}`} alt={product.name} />
        <div className='productDetails'>
          <div className='productDetailsName'>{product.name}</div>
          <div className='productPrice'>${product.price}</div>
          <div className='productBeat'></div>
          <div className='productBeatTwo'></div>
          <div className='productColorChooses'>
            {product.colors.map((color, index) => (
              <div key={index} className='productColorChoose' style={{ backgroundColor: color }}></div>
            ))}
          </div>
          <div className='productSizeChooses'>
            {Object.entries(product.size).map(([key, value]) => (
              <div className='productSizeChooses'>
                <div key={key} className='productSizeChoose'>
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className='productDetailContainer'>
            <div className='productQuantityContainer'>
              <div className='productHowMuch' onClick={decreaseQuantity}>-</div>
              <div className='productQuantity'>{quantity}</div>
              <div className='productHowMuch2' onClick={increaseQuantity}>+</div>
            </div>
            <div className='productDetailBuy'>
              BUY NOW
            </div>
            <div className='productDetailBuy'>
              ADD TO WISHLIST
            </div>
          </div>
        </div>
      </div>
      <div className='angelina'>
        <div className='productDetailsNav'>
          <div
            className={`productDetailsNavButton ${activeTab === 'description' ? 'productTargetInfo' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            description
          </div>
          <div
            className={`productDetailsNavButton ${activeTab === 'additional' ? 'productTargetInfo' : ''}`}
            onClick={() => setActiveTab('additional')}
          >
            additional information
          </div>
          <div
            className={`productDetailsNavButton ${activeTab === 'reviews' ? 'productTargetInfo' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            reviews
          </div>
        </div>
      </div>
      <div className='productDetailsContent'>
        {activeTab === 'description' && <div className='productDesc'>
          <div className='productDetailDesc'>
            <div style={{fontSize: 25, marginBottom: "10px"}}>{product.name}</div>
            <div>{product.description}</div>
          </div>
          <div className='productRecom'>12312312312312312412312</div>
          {/* <div className='productSeller'>Seller: {product.seller}</div> */}
        </div>}
        {activeTab === 'additional' && <div style={{ color: "white" }}>
          {Object.entries(product.characteristics).map(([key, value]) => (
            <div key={key} className='productChar'>
              {value}
            </div>
          ))}
        </div>}
        {activeTab === 'reviews' && <p>Here are the reviews.</p>}
      </div>

    </div>
  );
}

export default ProductDetails;
