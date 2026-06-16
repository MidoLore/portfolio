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
        setActiveWindow(name)
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

                <Window
                    title="ABOUT ME"
                    isOpen={windows.about}
                    onClose={() => closeWindow('about')}
                    onFocus={() => setActiveWindow('about')}
                    isActive={activeWindow === 'about'}
                    width={900}
                    height={600}
                >
                    <div className='p-6 flex flex-col gap-6 overflow-y-auto absolute inset-0 top-13'>
                        <div className='flex items-center gap-6 border-b border-[#00ffc820] pb-6'>
                            <img
                                src='/picture.jpg'
                                alt='Mido'
                                className='w-50 h-50 rounded-full border-2 border-[#00ffc840] object-cover'
                            />
                            <div>
                                <h2 className='text-5xl tracking-widest'>Mohamed Muhuyadin</h2>
                                <p className='text-xl opacity-60 mt-1'>Master's student @ University of Oslo</p>
                                <p className='text-xl opacity-60'>Software Engineer</p>
                            </div>
                        </div>

                        <div>
                            <h2 className='text-3xl tracking-widest mb-2'>EDUCATION</h2>
                            <p className='text-xl opacity-80'>Masters in Informatics – Programming & Systems Architecture</p>
                            <p className='text-xl opacity-60'>University of Oslo, 2025 – present</p>
                            <p className='text-xl opacity-80 mt-2'>Bachelors in Informatics – Design, Use, Interaction</p>
                            <p className='text-xl opacity-60'>University of Oslo, 2020 – 2023</p>
                        </div>

                        <div>
                            <h2 className='text-3xl tracking-widest mb-2'>SKILLS</h2>
                            <div className='flex flex-wrap gap-2'>
                                {['Python', 'Java', 'Kotlin', 'Spring Boot', 'SQL', 'HTML', 'CSS', 'JavaScript', 'C++', 'Unreal Engine', 'Docker', 'Git', 'Linux'].map(skill => (
                                    <span key={skill} className='border border-[#00ffc840] px-3 py-1 text-lg tracking-widest hover:bg-[#00ffc820]'>
                        {skill}
                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className='text-3xl tracking-widest mb-2'>LANGUAGES</h2>
                            <p className='text-xl opacity-60'>Norwegian – Fluent</p>
                            <p className='text-xl opacity-60'>English – Strong written and spoken</p>
                            <p className='text-xl opacity-60'>Somali – Native</p>
                        </div>
                    </div>
                </Window>
                <Window title="PROJECTS" isOpen={windows.projects} onClose={() => closeWindow('projects')} onFocus={() => setActiveWindow('projects')} width={600} height={300} />
            </div>

        </div>
    )
}

export default App