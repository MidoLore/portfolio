import Window from './components/Window'
import {useState} from "react";
import Topbar from "./components/Topbar.jsx";
import Icons from "./components/Icons.jsx";

function App() {
    const [windows, setWindows] = useState({
        about: false,
        projects: false,
        skills: false,
        contact: false,
    });

    const [activeWindow, setActiveWindow] = useState(null);

    function openWindow(name) {
        setWindows({ ...windows, [name]: true })
    }

    function closeWindow(name) {
        setWindows({ ...windows, [name]: false })
    }

    return (
        <div className='w-screen h-screen bg-[#0a0f1e] flex flex-col'>

            <div>
                <Topbar />
            </div>

            <div
                id="desktop"
                className='relative flex-1'
                style={{
                    backgroundImage: `linear-gradient(#00ffc808 1px, transparent 1px), linear-gradient(90deg, #00ffc810 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            >
                <Icons title="ABOUT ME" icon={""} onClick={() => openWindow('about') } />
                <Icons title="PROJECTS" onClick={() => openWindow('projects')} />

                <Window title="ABOUT ME" isOpen={windows.about} onClose={() => closeWindow('about')} onFocus={() => setActiveWindow('about')} isActive={activeWindow === 'about'} width={900} height={600}>
                    <p>Hi I'm Mido</p>
                    <p>I study at UiO</p>
                </Window>
                <Window title="PROJECTS" isOpen={windows.projects} onClose={() => closeWindow('projects')} onFocus={() => setActiveWindow('projects')} width={600} height={300} />
            </div>

        </div>
    )
}

export default App