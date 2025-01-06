import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import checkColor from './assets/checkColor';
import axios from 'axios';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import custom from './assets/json/custom.json';

function ThemeConstructor({ constructor, settings, setSettings, width }) {

    const navigate = useNavigate();

    const [saveStatus, setSaveStatus] = useState(0);

    const [localBg, setLocalBg] = useState("#2e5a97");
    const [localFont, setLocalFont] = useState("#f1f1f1");

    const [bgText, setBgText] = useState("#2e5a97");
    const [fontText, setFontText] = useState("#f1f1f1");

    const [editBgText, setEditBgText] = useState(false);
    const [editFontText, setEditFontText] = useState(false);

    const [loadApply, setLoadApply] = useState(false);
    const [loadSave, setLoadSave] = useState(false);

    const [themeInstructionsDisplay, setThemeInstructionsDisplay] = useState(localStorage.getItem("themeInstructionsDisplay") || "flex");

    const alertRef = useRef(null);

    const { authState } = useContext(AuthContext);

    const loaderStyles = {
        width: "1.1rem",
        height: "1.1rem",
        borderColor: localFont,
        borderBottomColor: "transparent"
    }

    useEffect(() => {
        document.addEventListener("keydown", event => {
            if ((event.key == "r") || (event.key == "к")) generateTheme();
        }, true);
        axios.get(
            `${import.meta.env.VITE_API_KEY}/users/changeTheme`,
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            setLocalBg(response.data.lastBg || "#2e5a97");
            setLocalFont(response.data.lastFont || "#f1f1f1");
            setBgText(response.data.lastBg || "#2e5a97");
            setFontText(response.data.lastFont || "#f1f1f1");
        });
    }, []);

    function inputBg(color) {
        if (checkColor(color)) {
            setLocalBg(color);
        }
        setBgText(color);
    }

    function inputFont(color) {
        if (checkColor(color)) {
            setLocalFont(color);
        }
        setFontText(color);
    }

    function generateTheme() {
        const colors = [`#${Math.random().toString(16).substring(2, 8)}`, `#${Math.random().toString(16).substring(2, 8)}`]
        setLocalBg(colors[0]);
        setLocalFont(colors[1]);
        setBgText(colors[0]);
        setFontText(colors[1]);
    }

    function applyTheme() {
        setLoadApply(true);
        axios.put(
            `${import.meta.env.VITE_API_KEY}/users/theme`,
            { theme: 3, id: authState.id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {
            return axios.put(
                `${import.meta.env.VITE_API_KEY}/users/lastTheme`,
                { lastBg: localBg, lastFont: localFont, id: authState.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );
        }).then(response => {

            let bg;
            let font;
            
            setSettings({ ...settings, theme: 3 });
            constructor.current.close();

            setLoadApply(false);

            document.body.classList.remove("dark");
            document.body.classList.remove("light");
            document.body.classList.add('theme-transition');
            setTimeout(() => document.body.classList.remove('theme-transition'), 500);

            if (settings.invertTheme && settings.bulbStatus == "on") {
                bg = response.data.lastFont;
                font = response.data.lastBg;
            }
            else {
                bg = response.data.lastBg;
                font = response.data.lastFont;
            }

            const customProperties = [bg, font, bg, bg, bg, bg, `${font} 3px solid`, `${font} 1px solid`, bg, font, font, font]
            for (let i = 0; i < customProperties.length; i++) {
                document.documentElement.style.setProperty(custom[i], customProperties[i]);
            }
        });
    }

    function saveTheme() {
        setLoadSave(true);
        axios.post(
            `${import.meta.env.VITE_API_KEY}/savedthemes`,
            { bg: localBg, font: localFont },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            setLoadSave(false);
            setSaveStatus(Number(response.data.status));
            alertRef.current.showModal();
            setTimeout(() => alertRef.current.close(), 3000);
        });
    }

    return (
        <dialog className="theme" ref={constructor}>
            <div className="instructions" style={{display: themeInstructionsDisplay}}>
                <p>{text[settings.language].themeInstructions}</p>
                <svg onClick={() => {localStorage.setItem("themeInstructionsDisplay", "none"); setThemeInstructionsDisplay("none")}} viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd"><g id="work-case" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
            </div>
            <hr style={{display: themeInstructionsDisplay}}/>
            <div className="themeHeader">
                <div>
                    <label>
                        {text[settings.language].customTheme[0]}<br />
                        <span>(
                            {text[settings.language].current}:&nbsp;
                            {editBgText ?
                            <input type="text" value={`#${bgText?.slice(1)}`} onChange={event => inputBg(event.target.value)} />
                            : <span style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => setEditBgText(true)}>{localBg}</span>}
                        )</span>
                    </label>
                    <input type="color" value={localBg} onChange={event => {
                        setLocalBg(event.target.value);
                        setBgText(event.target.value);
                    }} />
                </div>
                <div>
                    <label>
                        {text[settings.language].customTheme[1]}<br />
                        <span>(
                            {text[settings.language].current}:&nbsp;
                            {editFontText ?
                            <input type="text" value={`#${fontText?.slice(1)}`} onChange={event => inputFont(event.target.value)} />
                            : <span style={{textDecoration: "underline", cursor: "pointer"}} onClick={() => setEditFontText(true)}>{localFont}</span>}
                        )</span>
                    </label>
                    <input type="color" value={localFont} onChange={event => {
                        setLocalFont(event.target.value);
                        setFontText(event.target.value);
                    }} />
                </div>
                {settings.invertTheme &&
                <div style={{fontStyle: "italic", margin: "-0.2rem 0 0.5rem 0", justifyContent: "center"}}>
                    ({text[settings.language].themeCurrentlyInverted})
                </div>}
            </div>
            <hr/>
            <button className="modal-options" onClick={generateTheme}>
                <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d={paths.generate}/></svg>
                {text[settings.language].generateRandom + (width >= 600 ? " (r)" : "")}
            </button>
            <hr/>
            <div className="sample" style={{ backgroundColor: settings.invertTheme ? localFont : localBg, color: settings.invertTheme ? localBg : localFont }}>
                <p>{text[settings.language].sample}</p>
                <div>
                    <button
                        onClick={applyTheme}
                        disabled={loadApply}
                        style={{backgroundColor: "transparent", border: `${settings.invertTheme ? localBg : localFont} 3px solid`}}
                        title={text[settings.language].themeControls[0]}
                    >
                        {loadApply ? <span className="loader" style={loaderStyles} />
                        : <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.apply} stroke={settings.invertTheme ? localBg : localFont} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                    <button
                        onClick={() => constructor.current.close()}
                        style={{backgroundColor: "transparent", border: `${settings.invertTheme ? localBg : localFont} 3px solid`}}
                        title={text[settings.language].themeControls[1] + (width >= 600 ? " (c)" : "")}
                    >
                        <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="work-case" fill={settings.invertTheme ? localBg : localFont} transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                    </button>
                    <button
                        onClick={saveTheme}
                        disabled={loadSave}
                        style={{backgroundColor: "transparent", border: `${settings.invertTheme ? localBg : localFont} 3px solid`}}
                        title={text[settings.language].themeControls[2]}
                    >
                        {loadSave ? <span className="loader" style={loaderStyles} />
                        : <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.save} stroke={settings.invertTheme ? localBg : localFont} strokeWidth="2" strokeLinejoin="round"/></svg>}
                    </button>
                </div>
            </div>

            <dialog
                className="save-alert"
                ref={alertRef}
                style={{
                    backgroundColor: `var(--light-${saveStatus ? "green" : "red"})`,
                    color: `var(--dark-${saveStatus ? "green" : "red"})`,
                    marginTop: width >= 600
                    ? (settings.invertTheme ? "37.3rem" : "36.5rem")
                    : (settings.invertTheme ? "34.9rem" : "34.2rem")
                }}>
                <div>
                    <p>
                        {text[settings.language].savedStatus[saveStatus][0]}
                        <span onClick={() => navigate("/saved")} style={{textDecoration: "underline", color: "blue", cursor: "pointer"}}>
                            {text[settings.language].savedStatus[saveStatus][1]}
                        </span>!
                    </p>
                    <button onClick={() => alertRef.current.close()}>
                        <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" strokeWidth="1" fill={`var(--dark-${saveStatus ? "green" : "red"})`} fillRule="evenodd"><g id="work-case" transform="translate(91.520000, 91.520000)"><polygon id="Close" points={paths.cancel} /></g></g></svg>
                    </button>
                </div>
            </dialog>
        </dialog>
    );
}

export default ThemeConstructor;
