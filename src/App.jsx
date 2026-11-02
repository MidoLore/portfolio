import Window from './components/Window'
import {useState} from "react";
import Topbar from "./components/Topbar.jsx";
import Icons from "./components/Icons.jsx";

function App() {
    const [windows, setWindows] = useState({
        about: false,
        projects: false,
        skills: false,
        steamstats: false,
    });

    const skillCategories = {
        Languages: ['Python', 'Java', 'Kotlin', 'JavaScript', 'C++', 'SQL'],
        Web: ['React', 'Tailwind', 'HTML/CSS', 'FastAPI', 'Spring Boot'],
        Tools: ['Git', 'Docker', 'Linux', 'SQLite', 'Unreal Engine'],
        Also: ['Software Testing', 'Cybersecurity', 'DHIS2'],
    }

    const [activeWindow, setActiveWindow] = useState(null);

    const [positions, setPositions] = useState({});

    function openWindow(name) {
        const offset = {
            x: Math.floor(Math.random() * 200) - 100, // -100 to +100 px from center
            y: Math.floor(Math.random() * 120) - 60,
        };
        setPositions(p => ({ ...p, [name]: offset }));
        setWindows(w => ({ ...w, [name]: true }));
        setActiveWindow(name);
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
                    backgroundImage: `
                        linear-gradient(#00ffc808 1px, transparent 1px),
                        linear-gradient(90deg, #00ffc810 1px, transparent 1px),
                        repeating-linear-gradient(#00000030 0 2px, transparent 2px 4px),
                        linear-gradient(#0a0f1ecc, #0a0f1ecc),
                        url("/portfolio/background.png")
                    `,
                    backgroundSize: '20px 20px, 20px 20px, auto, auto, cover',
                    backgroundPosition: '0 0, 0 0, 0 0, 0 0, center',
                    backgroundRepeat: 'repeat, repeat, repeat, no-repeat, no-repeat',
                    imageRendering: 'pixelated',
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
                </div>

                <Window
                    title="ABOUT ME"
                    isOpen={windows.about}
                    offset={positions.about}
                    onClose={() => closeWindow('about')}
                    onFocus={() => setActiveWindow('about')}
                    isActive={activeWindow === 'about'}
                    width={900}
                    height={600}
                >
                    <div className='p-6 flex flex-col gap-6 overflow-y-auto absolute inset-0 top-13'>
                        <div className='flex items-center gap-6 border-b border-[#00ffc820] pb-6'>
                            <img
                                src={"/portfolio/picture.jpg"}
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
                            <p className='text-xl opacity-60'>English – Fluent</p>
                            <p className='text-xl opacity-60'>Somali – Native</p>
                        </div>
                    </div>
                </Window>
                <Window title="PROJECTS" isOpen={windows.projects} onClose={() => closeWindow('projects')} onFocus={() => setActiveWindow('projects')} isActive={activeWindow === 'projects'} width={600} height={300} offset={positions.projects}>
                    <div className='p-6 grid grid-cols-4 gap-4 overflow-y-auto absolute inset-0 top-13'>
                        <Icons
                            title="SteamStats"
                            bare
                            icon={
                                <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                                </svg>
                            }
                            onClick={() => openWindow('steamstats')}
                        />
                    </div>
                </Window>
                <Window title="SteamStats" isOpen={windows.steamstats} onClose={() => closeWindow('steamstats')} onFocus={() => setActiveWindow('steamstats')} isActive={activeWindow === 'steamstats'} width={700} height={500} offset={positions.steamstats}>
                <div className='p-6 overflow-y-auto absolute inset-0 top-13'>
                        <h2 className='text-3xl tracking-widest mb-3'>SteamStats</h2>
                        <p className='text-lg opacity-80 mb-4'>A SteamDB-style analytics tool for exploring 171k+ games. tag trends, tag combo gaps, and review rankings.</p>
                        <img
                            src={`./portfolio/steamstats.png`}
                            alt='SteamStats screenshot'
                            className='w-full mb-4 border border-[#00ffc840] rounded'
                        />
                        <div className='flex flex-wrap gap-2'>
                            {['React', 'FastAPI', 'SQLite', 'Python'].map(t => (
                                <span key={t} className='border border-[#00ffc840] px-3 py-1 text-lg tracking-widest hover:bg-[#00ffc820]'>{t}</span>
                            ))}
                        </div>
                        <a href="https://github.com/MidoLore/steam-stats" target="_blank" rel="noopener noreferrer" className='inline-block mt-6 text-lg tracking-widest text-[#00ffc8] hover:underline'>
                            View on GitHub →
                        </a>
                    </div>
                </Window>
                <Window
                    title="SKILLS"
                    isOpen={windows.skills}
                    onClose={() => closeWindow('skills')}
                    onFocus={() => setActiveWindow('skills')}
                    isActive={activeWindow === 'skills'}
                    width={700}
                    height={500}
                    offset={positions.skills}
                >
                    <div className='p-6 flex flex-col gap-5 overflow-y-auto absolute inset-0 top-13'>
                        {Object.entries(skillCategories).map(([category, skills]) => (
                            <div key={category}>
                                <h2 className='text-2xl tracking-widest mb-2'>{category.toUpperCase()}</h2>
                                <div className='flex flex-wrap gap-2'>
                                    {skills.map(skill => (
                                        <span key={skill} className='border border-[#00ffc840] px-3 py-1 text-lg tracking-widest hover:bg-[#00ffc820]'>
                            {skill}
                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Window>
            </div>

        </div>
    )
}

export default App