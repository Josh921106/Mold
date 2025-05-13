import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/styles/title.css";
import "../assets/styles/404.css";

export default function Error404() {
    const navigate = useNavigate();
    const rocketRef = useRef(null);
    const meteorRef = useRef(null);
    const [rocketStyle, setRocketStyle] = useState({ top: "30%", left: "10%" });
    const [meteorStyle, setMeteorStyle] = useState({ top: "60%", left: "90%" });

    useEffect(() => {
        document.title = "404 - 頁面不存在";

        const moveRandomly = (setState, minTop, maxTop, minLeft, maxLeft) => {
            const newTop = Math.random() * (maxTop - minTop) + minTop;
            const newLeft = Math.random() * (maxLeft - minLeft) + minLeft;
            setState({ top: `${newTop}%`, left: `${newLeft}%` });
        }

        const intervalRocket = setInterval(() => {
            moveRandomly(setRocketStyle, 20, 80, 0, 100);
        }, 100);

        const intervalMeteor = setInterval(() => {
            moveRandomly(setMeteorStyle, 20, 80, 0, 100);
        }, 100);

        return () => {
            clearInterval(intervalRocket);
            clearInterval(intervalMeteor);
        }
    }, []);

    return (
        <div className="vh-100 vw-100 user-select-none">
            <Sidebar />
            <div className="d-flex flex-column justify-content-center align-items-center text-center text-white w-100 not-found-bg" style={{ height: "100%" }}>
                <div style={{ pointerEvents: "none" }}>
                    <div className="stars" />
                    <div className="stars2" />
                    <div className="stars3" />

                    <div
                        ref={rocketRef}
                        className="rocket" 
                        style={{ position: "absolute", fontSize: "2.5rem", cursor: "pointer", transition: "top 1.5s ease, left 1.5s ease", ...rocketStyle }}>
                        <h1>🚀</h1>
                    </div>

                    <div
                        ref={meteorRef}
                        className="meteor"
                        style={{ position: 'absolute', fontSize: '1.8rem', opacity: 0.6, transition: 'top 2s ease, left 2s ease', ...meteorStyle }}>
                        <h1>☄️</h1>
                    </div>

                    <div className="moon"><h1>🌕</h1></div>
                </div>

                <h1 className="display-1 fw-bold neon-404">404</h1>
                <br />
                <h2 className="mt-3">Oops! 這個頁面飛到宇宙去了</h2>
                <h5 className="text-light">你所尋找的內容不存在或已被移動</h5>
                <hr />
                <Button className="btn btn-outline-light px-4 py-2" onClick={() => { navigate("/"); }}>
                    返回首頁
                </Button>
            </div>
        </div>
    )
};