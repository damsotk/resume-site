import React, { useState, useEffect } from 'react';
import './main-page-hello.css';

const MainPageHello = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const textInfo = document.querySelector('.text-info');
        const infoText = textInfo.innerText;
        textInfo.innerHTML = '';

        infoText.split('').forEach((char, index) => {
            const charElement = document.createElement('span');
            charElement.textContent = char;
            charElement.style.animation = `appear 0.5s ${index * 0.1 + 2}s forwards`;
            textInfo.appendChild(charElement);
        });
        const textGreeting = document.querySelectorAll('.text-greeting');

        textGreeting.forEach((element) => {
            let charIndex = 0;
            let greetingText = element.innerText;
            element.innerText = '';

            function typeChar() {
                if (charIndex < greetingText.length) {
                    element.innerHTML += greetingText.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, 100);
                }
            }

            typeChar();
        });
    }, []);

    return (
        <header>
            <div className="container" style={{ marginTop: 0 }}>
                <div className="header">
                    <div className="logo">damsot</div>
                    <div
                        className="col"
                        id="openModalBtn"
                        onClick={() => setModalOpen(true)}
                    >
                        For collaboration
                    </div>
                </div>
                <div className="just-flex-yo">
                    <div className="text-greeting">Hello!</div>
                    <div className="text-info">
                        My name is Denis, and I've been studying Front-end development for about a year now. I'm highly
                        proficient in English. I've covered many topics within this field, solidifying my knowledge
                        through
                        extensive practice. You'll learn more about me below!
                    </div>
                    <div className="btn btn-animation">
                        <span>LEARN MORE</span>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modalMainPage" onClick={() => setModalOpen(false)}>
                    <div className="modalContentMainPage" onClick={(e) => e.stopPropagation()}>
                        {/* <div className="logoForModalMainPage">DAMSOT</div> */}
                        <div className="modalDesignMainPage"></div>
                        <div className="modalDesignMainPage2"></div>
                        <span className="close" onClick={() => setModalOpen(false)}>
                            &times;
                        </span>
                        <div className="socialIconsMainPage">
                            <a
                                href="https://github.com/damsotk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="socialIcon githubIcon"
                            ></a>
                            <a
                                href="https://x.com/damsotit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="socialIcon twitterIcon"
                            ></a>
                            <a
                                href="https://www.instagram.com/ddamsot/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="socialIcon instagramIcon"
                            ></a>
                            <a
                                href="https://www.linkedin.com/in/denis-piyack-2b3784292/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="socialIcon linkedinIcon"
                            ></a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default MainPageHello;