

import './shop-footer.css';

function ShopFooter() {
    return (
        <div className='footerFlex'>
            <div className='tablesFlexShop'>
                <div className='tableInfoFooterShop' style={{display: "flex", gap: 30}}>
                    <div className="logo">
                        DAMSOT
                    </div>
                    <ul>
                        <li>
                            <span>About us</span>
                            <ul>
                                <li style={{ width: 300 }}>Explore New Wave, your online destination for the latest teen fashion! We bring you a curated selection of stylish apparel that reflects the unique personalities of today’s youth.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='tableInfoFooterShop'>
                    <ul>
                        <li>
                            <span>Info</span>
                            <ul>
                                <li>About us</li>
                                <li>Delivery</li>
                                <li>Exchange and return</li>
                                <li>FAQ</li>
                                <li>Privacy Policy</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='tableInfoFooterShop'>
                    <ul>
                        <li>
                            <span>Help</span>
                            <ul>
                                <li>Contact us</li>
                                <li>Locate delivery</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='tableInfoFooterShop'>
                    <ul>
                        <li>
                            <span>Payment</span>
                            <ul>
                                <li>Bank card</li>
                                <li>During pick</li>
                                <li>Electronic certificate</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='tableInfoFooterShop'>
                    <ul>
                        <li>
                            <span>Contact us</span>
                            <ul>
                                <li>damsotclothes@gmail.com</li>
                                <li>+38(066)-955-35-96</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ShopFooter;


