import axios from 'axios';
import custom from './json/custom.json';

const systemTheme = () => {
    window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ?
    darkTheme() : lightTheme();
}

const lightTheme = () => {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    axios.get(
        `${import.meta.env.VITE_API_KEY}/users/changeTheme`,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then(response => {
        if ((response.data.error && parseInt(localStorage.getItem("invertTheme")) && localStorage.getItem("bulbStatus") == "on")
        || (response.data.invertTheme && response.data.bulbStatus == "on")) {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
        }
        else {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
        }
    });
}

const darkTheme = () => {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    axios.get(
        `${import.meta.env.VITE_API_KEY}/users/changeTheme`,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then(response => {
        if ((response.data.error && parseInt(localStorage.getItem("invertTheme")) && localStorage.getItem("bulbStatus") == "on")
        || (response.data.invertTheme && response.data.bulbStatus == "on")) {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
        }
        else {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
        }
    });
}

const customTheme = (loggedIn = 1) => {
    axios.get(
        `${import.meta.env.VITE_API_KEY}/users/changeTheme`,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then(response => {

        let bg;
        let font;

        document.body.classList.remove("dark");
        document.body.classList.remove("light");
        document.body.classList.add('theme-transition');
        setTimeout(() => document.body.classList.remove('theme-transition'), 500);

        if (loggedIn) {

            if (response.data.invertTheme && response.data.bulbStatus == "on") {
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
        }
        else {
            
            if (parseInt(localStorage.getItem("invertTheme")) && localStorage.getItem("bulbStatus") == "on") {
                bg = localStorage.getItem("stroke");;
                font = localStorage.getItem("bg");
            }
            else {
                bg = localStorage.getItem("bg");
                font = localStorage.getItem("stroke");;
            }

            const customProperties = [bg, font, bg, bg, bg, bg, `${font} 3px solid`, `${font} 1px solid`, bg, font, font, font]

            for (let i = 0; i < customProperties.length; i++) {
                document.documentElement.style.setProperty(custom[i], customProperties[i]);
            }
        }
    });
}

const themes = [
    systemTheme, lightTheme, darkTheme, customTheme, () => {}
]

export default themes