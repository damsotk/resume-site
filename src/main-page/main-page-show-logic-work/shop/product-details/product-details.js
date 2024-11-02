import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ShopHeader from '../shop-header/shop-header';
import './product-details-animations.css'
import './product-details.css'
import ShopFooter from '../shop-footer/shop-footer';
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
            <div className='flexForButtons'>
              <div className='productQuantityContainer'>
                <div className='productHowMuch' onClick={decreaseQuantity}>-</div>
                <div className='productQuantity'>{quantity}</div>
                <div className='productHowMuch2' onClick={increaseQuantity}>+</div>
              </div>
              <div className='productDetailBuy' style={{ width: "100%" }}>
                ADD TO WISHLIST
              </div>
            </div>
            <div className='productDetailBuy' style={{ width: "100%" }}>
              BUY NOW
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
            <div style={{ fontSize: 45 }}>{product.name}</div>
            <div style={{ fontSize: 25 }}>{product.description}</div>
          </div>
          <div className='productDetailDescRecom'>
            <div className='productRecomIcon'>
              <img src={`http://localhost:3000/images/dryer.png`} alt="iconNo" />
              <div>Do not dry in a tumble dryer</div>
            </div>
            <div className='productRecomIcon'>
              <img src={`http://localhost:3000/images/washer.png`} alt="iconNo" />
              <div>Do not wash</div>
            </div>
            <div className='productRecomIcon'>
              <img src={`http://localhost:3000/images/paint-roller.png`} alt="iconNo" />
              <div>Do not bleach</div>
            </div>
            <div className='productRecomIcon'>
              <img src={`http://localhost:3000/images/steam-iron.png`} alt="iconNo" />
              <div>Do not iron</div>
            </div>
          </div>
          {/* <div className='productSeller'>Seller: {product.seller}</div> */}
        </div>}
        {activeTab === 'additional' && <div className='additionalFlex'>
          {Object.entries(product.characteristics).map(([key, value]) => (
            <div key={key} className='additionalInfo'>
              {value}
            </div>
          ))}
        </div>}
        {activeTab === 'reviews' && <p>Here are the reviews.</p>}
      </div>
      <ShopFooter />

    </div>
  );
}

export default ProductDetails;
