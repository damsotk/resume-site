import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './product-details.css'
import './product-details-animation.css'
import ShopFooter from '../shop-footer/shop-footer';
import useBallsAnimation from '../../../hooks/useBallsAnimation';
import ShopHeader from '../shop-header/shop-header';
import { useLocation } from 'react-router-dom';

function ProductDetails() {
  const balls = useBallsAnimation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  const [addedProducts, setAddedProducts] = useState({});

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const [otherProducts, setOtherProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(4);

  const [importNameForHeader, setimportNameForHeader] = useState("")

  const location = useLocation();
  const pageClass = location.pathname.replace(/\//g, '-');

  const handleClick = (productId) => {
    console.log(productId)
    setAddedProducts(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(response => response.json())
      .then(data => {setimportNameForHeader(data.name); setProduct(data);})
      .catch(error => console.error('Error fetching product details:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product details:', error));

    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(data => {
        setOtherProducts(data);
      })
      .catch(error => console.error('Error fetching other products:', error));
  }, [id]);

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisible => prevVisible + 4);
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const newLeft = clientX / innerWidth * 20;
      const newTop = clientY / innerHeight * 20;

      setPosition({ top: newTop, left: newLeft });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


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

  const renderAnimatedText = (text) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        style={{
          transform: `rotate(${i * 10.3}deg)`,
          position: 'absolute',
          left: '50%',
          transformOrigin: '0 300px',
          fontSize: '1.5em',
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div className='backgroundShop'>
      <div className='containerForBalls'></div>
      <ShopHeader importNameForHeader={importNameForHeader} />

      <div className='productDetailsFlex'>
        <div className={`productShopName letters${pageClass}`} style={{ backgroundImage: `url("http://localhost:3000/images/texture_black.jpg")` }}>
          <div
            className='imageProductShop'
            style={{
              backgroundImage: `url("http://localhost:3000${product.imageUrl}")`,
              transform: `translate(${position.left}px, ${-position.top}px)`
            }}
          />
          {product.name && product.name.split(' ').map((word, index, array) => {
            if (index === 0) {
              return <div key={index} className="productNameOne">{word}</div>;
            } else if (index === 1) {
              return <div key={index} className="productNameTwo">{word}</div>;
            } else if (index === 2) {
              const remainingWords = array.slice(index).join(' ');
              return <div key={index} className="productNameThree">{remainingWords}</div>;
            }
            return null;
          })}
        </div>
      </div>
      <div className='buyOrDie'>
        <div className='productBuyNowButton'>
          BUY NOW
        </div>
      </div>
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
      <div className='productDetailsContent'>
        {activeTab === 'description' && <div className='productDesc'>
          <div className='productDescImages'>
            <div className='productDescImage' style={{ backgroundImage: `url("http://localhost:3000${product.imageUrl}")` }}>
            </div>
            {/* <div className='productDescImageBack' style={{ backgroundImage: `url("http://localhost:3000/images/texture_black3.jpg")` }} > </div> */}
            <div className="animCircleText">
              {renderAnimatedText('damsot.shop hope you are like this')}
            </div>
          </div>
          <div className='productDescInfo'>
            <div className='productDetailDesc'>
              <div style={{ fontSize: 45 }}>{product.name}</div>
              <div style={{ fontSize: 25 }}>{product.description}</div>
              <div className='productDetailDescAdditional'>
                {Object.entries(product.characteristics).map(([key, value]) => (
                  <div key={key} className='additionalInfo'>
                    {value}
                  </div>
                ))}
                <div className='additionalInfo'>Seller: {product.seller}</div>
              </div>
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
          </div>
        </div>}
        {activeTab === 'additional' && <div className='additionalFlex'>
          here add
        </div>}
        {activeTab === 'reviews' && <p>Here are the reviews.</p>}
      </div>
      <div className='otherProducts'>
        <div className='textForOtherProductBig'>
          MOOOOOOORE
          <div className='textForOtherProductSmall'>
            CLOTHES
          </div>
        </div>
        <div className='shopAllProducts'>
          {otherProducts.slice(0, visibleProducts).map((otherProduct) => (
            <div key={otherProduct.id} className='shopProduct'>
              <div onClick={() => handleClick(otherProduct.id)} className={`icon ${addedProducts[otherProduct.id] ? 'checked' : 'plus'}`}></div>
              <img style={{ position: 'relative' }} src={`http://localhost:3000${otherProduct.imageUrl}`} className="productImage" alt={otherProduct.name} />
              <div className="productInfo">
                <div className="productName">
                  {otherProduct.name}
                </div>
                <div className="productPrice">
                  ${otherProduct.price}
                </div>
              </div>
              <div className="buyButton">
                <div className="buyButtonText old">Nice choice!</div>
                <div className="buyButtonText new">Buy Now!</div>
              </div>
            </div>
          ))}
        </div>
        {visibleProducts < otherProducts.length && (
          <button onClick={loadMoreProducts} className='loadMoreButton'>
            Load More
          </button>
        )}
      </div>

      <ShopFooter />
    </div>
  );
}

export default ProductDetails;
