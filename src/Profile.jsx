import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import ProfileFontLoader from './ProfileFontLoader';
import closeModal from './assets/closeModal';
import getFontFamily from './assets/getFontFamily';
import axios from 'axios';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import on from './assets/svg/on.svg';
import off from './assets/svg/off.svg';
import { motion } from 'framer-motion';

function Profile({ settings, bulb }) {
    
    const navigate = useNavigate();

    const { authState } = useContext(AuthContext);

    const [user, setUser] = useState({});
    
    const [loadUser, setLoadUser] = useState(false);

    const [bgCopied, setBgCopied] = useState(false);
    const [strokeCopied, setStrokeCopied] = useState(false);
    const [fontCopied, setFontCopied] = useState(false);

    const [width, setWidth] = useState(window.innerWidth);

    const copyModal = useRef(null);

    const { username } = useParams();
    
    useEffect(() => {

        setLoadUser(true);
        document.title = username;
        window.addEventListener("resize", () => setWidth(window.innerWidth));

        axios.get(`${import.meta.env.VITE_API_KEY}/users/userinfo/${username}`)
        .then(response => {
            setUser(response.data);
            setLoadUser(false);
        });

        return () =>  window.removeEventListener("resize", () => setWidth(window.innerWidth))
    }, [username]);

    const customFont = user.font && user.font.startsWith("https://fonts.googleapis.com");
    const userMatch = authState.username === username;

    const userFont = customFont ? getFontFamily(user.font) : user.font || settings.font;

    const bg = Number(user.invertTheme && user.bulbStatus == "on") || 0;
    const font = Number(!user.invertTheme || user.bulbStatus != "on") || 0;

    const userTheme = [
        ["transparent", "#f4f0e8", "#171717", user?.lastBg],
        ["var(--font)", "#232323", "#dcdcdc", user?.lastFont]
    ];

    const locales = ["en-us", "ru-ru"];
    
    return (
        <motion.div
            className='profile'
            style={{backgroundColor: (!loadUser && userTheme[bg][user?.theme || 0]), border: (!loadUser && `${userTheme[font][user?.theme || 0]} 3px solid`)}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {loadUser ? <span className="loader" style={{width: "5rem", height: "5rem", borderWidth: "7px", margin: "auto"}} />
            : <>{
                user === null ? navigate("/page-not-found")
                : <>
                    {customFont && <ProfileFontLoader profileFont={user.font} />}
                    {(user?.theme == 3 || user.font) && <svg onClick={() => copyModal.current.showModal()} id="open-copy-modal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d={paths.copy[0]} fill={userTheme[font][user?.theme || 0]}></path><path d={paths.copy[1]} fill={userTheme[font][user?.theme || 0]}></path></g></svg>}
                    <div className="play">
                        <img ref={bulb} className={user.bulbStatus} src={user.bulbStatus == "on" ? on : off} />
                    </div>
                    <div className="user-info" style={{fontFamily: userFont}}>
                        <h1 style={{color: userTheme[font][user?.theme || 0]}}>{username}</h1>
                        <h2 className="joined" style={{color: userTheme[font][user?.theme || 0]}}>{
                            `${text[settings.language].joined} ${
                            new Date(user.createdAt)
                            .toLocaleDateString(locales[settings.language], {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })
                            .toLowerCase()
                        }`}</h2>
                        <h2 id="counter" style={{color: userTheme[font][user?.theme || 0]}}>
                            <span style={{fontWeight: "normal"}}>{text[settings.language].bulbCount}: </span>
                            <span style={{fontStyle: "italic"}}>{user.bulbCount || 0}</span>
                        </h2>
                    </div>
                    {userMatch &&
                    <button className="change-password" onClick={() => navigate("/changepassword")}>
                        {text[settings.language].changePassword[0]}
                    </button>}
                </>
            }</>}
            <dialog ref={copyModal} className="copy-modal">
                <h2>{text[settings.language].pickCopyColors[0]}</h2>
                <hr />
                <div
                    className="copy-section"
                    style={{color: userTheme[font][user?.theme || 0]}}
                    onClick={() => {
                        navigator.clipboard.writeText(userTheme[bg][user?.theme || 0])
                        .then(() => setBgCopied(true));
                    }}
                >
                    <div className="color-display" style={
                        user?.theme == 3 ?
                        {backgroundColor: userTheme[bg][user?.theme || 0]} :
                        {
                            background: `repeating-conic-gradient(${userTheme[bg][user?.theme || 0]} 0deg 90deg, ${userTheme[font][user?.theme || 0]} 90deg 180deg)`,
                            backgroundSize: `16px 16px`
                        }
                    }/>
                    <div>
                        <svg style={{display: bgCopied ? "block" : "none"}} className="asset-copied" id="bg-copied" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {user?.theme == 3 ? <>
                            <p style={{fontWeight: "bold"}}>{userTheme[bg][user?.theme || 0]}</p>
                            <p style={{fontStyle: "italic"}}>{text[settings.language].pickCopyColors[1]}</p>
                        </> :
                        <p style={{fontStyle: "italic"}}>
                            {text[settings.language].userThemeStatus[Number(userMatch)]}
                        </p>}
                    </div>
                </div>
                <div
                    className="copy-section"
                    style={{color: userTheme[bg][user?.theme || 0]}}
                    onClick={() => {
                        navigator.clipboard.writeText(userTheme[font][user?.theme || 0])
                        .then(() => setStrokeCopied(true));
                    }}
                >
                    <div className="color-display" style={
                        user?.theme == 3 ?
                        {backgroundColor: userTheme[font][user?.theme || 0]} :
                        {
                            background: `repeating-conic-gradient(${userTheme[bg][user?.theme || 0]} 0deg 90deg, ${userTheme[font][user?.theme || 0]} 90deg 180deg)`,
                            backgroundSize: `16px 16px`
                        }
                    } />
                    <div>
                        <svg style={{display: strokeCopied ? "block" : "none"}} className="asset-copied" id="stroke-copied" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {user?.theme == 3 ? <>
                            <p style={{fontWeight: "bold"}}>{userTheme[font][user?.theme || 0]}</p>
                            <p style={{fontStyle: "italic"}}>{text[settings.language].pickCopyColors[2]}</p>
                        </> :
                        <p style={{fontStyle: "italic"}}>
                            {text[settings.language].userThemeStatus[Number(userMatch)]}
                        </p>}
                    </div>
                </div>
                <hr />
                <div
                    className="copy-section"
                    style={{color: "var(--button-font)"}}
                    onClick={() => {
                        if (customFont) navigator.clipboard.writeText(user.font).then(() => setFontCopied(true))
                    }}
                >
                    <div className="color-display" style={{backgroundColor: "var(--modal-button-bg)"}}>
                        <span style={{fontFamily: userFont}}>{userFont.toLowerCase()}</span>
                    </div>
                    <div>
                        <svg style={{display: fontCopied ? "block" : "none"}} className="asset-copied" id="font-copied" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke="var(--button-font)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <p style={{fontStyle: "italic"}}>
                            {userMatch ? text[settings.language].yourFontStatus[Number(customFont)] : text[settings.language].userFontStatus[Number(customFont)]}
                        </p>
                    </div>
                </div>
                <hr />
                <div onClick={() => closeModal(copyModal)} className="close-copy">{text[settings.language].close}</div>
            </dialog>
        </motion.div>
    )
}

export default Profile