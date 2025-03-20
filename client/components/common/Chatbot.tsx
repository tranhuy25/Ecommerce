import { useEffect } from "react";
import Head from "next/head";
const Chatbot = () => {
    useEffect(() => {
        if (!document.querySelector(`script[src="/js/Chatbot.js"]`)) {
            const script = document.createElement("script");
            script.src = "/js/Chatbot.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);
    return (
        <>
            <Head>
                <link rel="stylesheet" href="/styles/Chatbot.css" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap" />
            </Head>
            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-infor">
                        <svg className="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                        </svg>
                        <h1 className="logo-text">Chatbot</h1>

                    </div>
                    <button id="close-chatbot" className="material-symbols-rounded">
                        keyboard_arrow_down
                    </button>
                </div>

                <div className="chatbot-body">
                    <div className="message bot-message">
                        <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                        </svg>
                        <div className="message-text">Hey there! <br /> How are you today ?</div>
                    </div>
                </div>

                <div className="chatbot-footer">
                    <form action="" className="chat-form">
                        <textarea placeholder="Message ..." id="" className="message-input" required></textarea>
                        <div className="chat-controls">
                            <button type="button" className="material-symbols-rounded">sentiment_satisfied</button>
                            <div className="file-upload-wrapper">
                                <input type="file" accept="image/*" id="file-input" hidden />
                                <img src="#" />
                                <button type="button" id="file-upload" className="material-symbols-rounded">attach_file</button>
                                <button type="button" id="file-cancel" className="material-symbols-rounded">close</button>
                            </div>
                            <button type="button" className="material-symbols-rounded" id="send-message">arrow_upward</button>
                        </div>
                    </form>
                </div>

            </div>
            <button id="toggle-chat" className="material-symbols-rounded">chat</button>
        </>
    );
};


export default Chatbot;
