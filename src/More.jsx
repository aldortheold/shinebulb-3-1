import { useNavigate } from 'react-router-dom';
import closeModal from './assets/closeModal';
import paths from './assets/json/svg-paths.json';
import text from './assets/json/text.json';

function More({ more, settings }) {

    const navigate = useNavigate();

    return (
        <dialog className="more" ref={more}>
            <div className="options">
                <div onClick={() => navigate("/saved")}>
                    <p>
                        <svg id="saved-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={paths.save} strokeWidth="2" strokeLinejoin="round"/></svg>
                        {text[settings.language].saved}
                    </p>
                    <span>{text[settings.language].optionDescriptions[0]}</span>
                </div>
                <hr />
                <button onClick={() => closeModal(more)}>{text[settings.language].back}</button>
            </div>
        </dialog>
    )
}

export default More