import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './assets/AuthContext';
import text from './assets/json/text.json';
import { motion } from 'framer-motion';

function FontSettings({ settings, setSettings }) {

    const { authState } = useContext(AuthContext);

    const navigate = useNavigate();

    function fontChange(event) {
        axios.put(
            `${import.meta.env.VITE_API_KEY}/users/changeFont`,
            { font: event.target.value, id: authState.id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(response => {
            document.documentElement.style.setProperty("--font-family", response.data);
            setSettings({...settings, font: response.data});
        })
    }

    return (
        <motion.div
            className='settings'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <div style={{ height: "3rem" }} />
            <h2>{text[settings.language].fontSettings}</h2>
            <div className="container">
                <label className="settingName" style={{textAlign: "left"}}>{text[settings.language].fontFamily}</label>
                <button>{text[settings.language].explore}...</button>
            </div>
            <div style={{ height: "4rem" }} />
            <a onClick={() => navigate("/settings")}>{text[settings.language].back}</a>
        </motion.div>
    )
}

export default FontSettings