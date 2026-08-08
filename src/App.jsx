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
                <div className='absolute top-5 left-4 flex flex-col gap-4'>
                    <Icons
                        title="ABOUT ME"
                        icon={
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M5 20a7 7 0 0 1 14 0" />
                            </svg>
                        }
                        onClick={() => openWindow('about')}
                    />
                    <Icons
                        title="PROJECTS"
                        icon={
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                            </svg>
                        }
                        onClick={() => openWindow('projects')}
                    />
                    <Icons
                        title="SKILLS"
                        icon={
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M8 6l-5 6 5 6" />
                                <path d="M16 6l5 6-5 6" />
                            </svg>
                        }
                        onClick={() => openWindow('skills')}
                    />
                        <Icons
                            title="CONTACT"
                            icon={
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="5" width="18" height="14" rx="2" />
                                    <path d="M3 7l9 6 9-6" />
                                </svg>
                            }
                            onClick={() => openWindow('contact')}
                        />
                </div>

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
                <Window title="SKILLS" isOpen={windows.skills} onClose={() => closeWindow('skills')} onFocus={() => setActiveWindow('skills')} width={600} height={300} />
                <Window title="CONTACT" isOpen={windows.contact} onClose={() => closeWindow('contact')} onFocus={() => setActiveWindow('contact')} width={600} height={300} />
            </div>

        </div>
    )
}

export default App