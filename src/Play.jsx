import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import axios from 'axios';
import themes from './assets/themes';
import paths from './assets/json/svg-paths.json';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function Play({ bulb, settings, setSettings }) {

    const { authState } = useContext(AuthContext);

    const [loadSwitch, setLoadSwitch] = useState(false);
    const [loadReset, setLoadReset] = useState(false);

    const [bulbMuted, setBulbMuted] = useState(false);

    useEffect(() => {
        document.title = text[settings.language].links[0].toLowerCase();
        if ((settings.bulbStatus === "on") && (bulb.current)) bulb.current.classList.add("on");
    }, []);

    const bulbStates = ["off", "on"];

    const navigate = useNavigate();

    const modal = useRef(null);

    function updateCount() {
        if (authState.status) {
            setLoadSwitch(true);
            axios.all([
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/count`,
                    { count: settings.bulbCount + Number(!bulbStates.indexOf(settings.bulbStatus)), id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ),
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/bulb`,
                    { status: Number(!bulbStates.indexOf(settings.bulbStatus)) ? "on" : "off", id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                )
            ]).then(axios.spread((count, status) => {
                setSettings({
                    ...settings,
                    bulbCount: count.data,
                    bulbStatus: status.data
                });
                if (!bulbMuted) new Audio(`audio/${status.data}.mp3`).play();
                bulb.current.classList.toggle("on");
                setLoadSwitch(false);
                if (settings.invertTheme) {
                    document.body.classList.add('theme-transition');
                    setTimeout(() => {
                        document.body.classList.remove('theme-transition');
                    }, 200);
                    themes[settings.theme]();
                }
            }));
        }
        else {
            setSettings({
                ...settings,
                bulbCount: settings.bulbStatus === "off" ? settings.bulbCount + 1 : settings.bulbCount,
                bulbStatus: settings.bulbStatus === "off" ? "on" : "off"
            });
            if (!bulbMuted) new Audio(`audio/${settings.bulbStatus === "off" ? "on" : "off"}.mp3`).play();
            bulb.current.classList.toggle("on");
            localStorage.setItem("bulbCount", settings.bulbStatus === "off" ? settings.bulbCount + 1 : settings.bulbCount);
            localStorage.setItem("bulbStatus", settings.bulbStatus === "off" ? "on" : "off");
            if (settings.invertTheme) {
                document.body.classList.add('theme-transition');
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 200);
                themes[settings.theme]();
            }
        }
    }

    function resetCount() {
        if (authState.status) {
            setLoadReset(true);
            axios.all([
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/count`,
                    { count: 0, id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ),
                axios.put(
                    `${import.meta.env.VITE_API_KEY}/users/bulb`,
                    { status: "off", id: authState.id },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                )
            ]).then(axios.spread((count, status) => {
                setSettings({
                    ...settings,
                    bulbCount: count.data,
                    bulbStatus: status.data
                });
                if (!bulbMuted) new Audio(`audio/off.mp3`).play();
                bulb.current.classList.remove("on");
                modal.current.close();
                if (settings.invertTheme) {
                    document.body.classList.add('theme-transition');
                    setTimeout(() => {
                        document.body.classList.remove('theme-transition');
                    }, 200);
                    themes[settings.theme]();
                }
            }));
        }
        else {
            setSettings({
                ...settings,
                bulbCount: 0,
                bulbStatus: "off"
            });
            localStorage.removeItem("bulbCount");
            localStorage.removeItem("bulbStatus");
            if (!bulbMuted) new Audio(`audio/off.mp3`).play();
            bulb.current.classList.remove("on");
            modal.current.close();
            if (settings.invertTheme) {
                document.body.classList.add('theme-transition');
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 200);
                themes[settings.theme]();
            }
        }
    }

    return (
        <motion.div 
            className="play"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <div className="play-heading">
                <svg viewBox="-0.5 0 25 25" fill="none" />
                <h2>{text[settings.language].headings[0]}</h2>
                {bulbMuted ? <svg onClick={() => setBulbMuted(false)} viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><title>{text[settings.language].bulbMuteUnmute[1]}</title><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/><g id="SVGRepo_iconCarrier"><path d={paths.soundOff[0]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d={paths.soundOff[1]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d={paths.soundOff[2]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
                : <svg onClick={() => setBulbMuted(true)} viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><title>{text[settings.language].bulbMuteUnmute[0]}</title><g id="SVGRepo_bgCarrier" strokeWidth="0"/><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/><g id="SVGRepo_iconCarrier"><path d={paths.soundOn[0]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d={paths.soundOn[1]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d={paths.soundOn[2]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g></svg>}
            </div>
            <p className="p1" id="text">{text[settings.language].text[bulbStates.indexOf(settings.bulbStatus)]}</p>
            <label htmlFor="switch">
                <img ref={bulb} src={`img/${settings.bulbStatus}.svg`} alt="the lightbulb" />
            </label>
            <div className="controls">
                <button onClick={updateCount} disabled={loadSwitch} id="switch">{
                    loadSwitch ? <span className="loader" style={{ width: "1rem", height: "1rem" }} />
                    : text[settings.language].controls[0]
                }</button>
                <button onClick={() => modal.current.showModal()}>{text[settings.language].controls[1]}</button>
            </div>
            <dialog ref={modal} className="confirm">
                <p>{text[settings.language].confirm[0]}</p>
                <button onClick={resetCount} disabled={loadReset}>{
                    loadReset ? <span className="loader" style={{ width: "1rem", height: "1rem" }} />
                    : text[settings.language].confirm[1]
                }</button>
                <button onClick={() => modal.current.close()}>{text[settings.language].confirm[2]}</button>
            </dialog>
            <h2 id="counter">{settings.bulbCount || 0}</h2>
            <a onClick={() => navigate("/")}>{text[settings.language].back}</a>
        </motion.div>
    )
}

export default Play
