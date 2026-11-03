import Window from './components/Window'
import {useState} from "react";
import Topbar from "./components/Topbar.jsx";
import Icons from "./components/Icons.jsx";
import ThemeBackground from "./components/ThemeBackground.jsx";
import ThemePicker from "./components/ThemePicker.jsx";

// theme color at a given opacity, for inline styles
const mix = (v, pct) => `color-mix(in srgb, var(--${v}) ${pct}%, transparent)`;

function App() {
    const [windows, setWindows] = useState({
        about: false,
        projects: false,
        skills: false,
        steamstats: false,
        theme: false,
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
        setWindows(w => ({ ...w, [name]: false }))
    }

    return (
        <div className='w-screen h-screen bg-bg text-fg flex flex-col'>

            <div>
                <Topbar />
            </div>

            <div
                id="desktop"
                className='relative flex-1'
                style={{
                    backgroundImage: `
                        linear-gradient(${mix('accent', 3)} 1px, transparent 1px),
                        linear-gradient(90deg, ${mix('accent', 6)} 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                }}
            >
                {/* first child: drawn above the wallpaper, below icons and windows */}
                <ThemeBackground />

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
                        title="THEME"
                        icon={
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-7.8-9-7.8z" />
                                <circle cx="7.5" cy="11" r="1" />
                                <circle cx="10" cy="7" r="1" />
                                <circle cx="14.5" cy="7" r="1" />
                            </svg>
                        }
                        onClick={() => openWindow('theme')}
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
                        <div className='flex items-center gap-6 border-b border-accent/12 pb-6'>
                            <img
                                src={"/portfolio/picture.jpg"}
                                alt='Mido'
                                className='w-50 h-50 rounded-full border-2 border-accent/25 object-cover'
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
                                    <span key={skill} className='border border-accent/25 px-3 py-1 text-lg tracking-widest hover:bg-accent/12'>
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
                            className='w-full mb-4 border border-accent/25 rounded'
                        />
                        <div className='flex flex-wrap gap-2'>
                            {['React', 'FastAPI', 'SQLite', 'Python'].map(t => (
                                <span key={t} className='border border-accent/25 px-3 py-1 text-lg tracking-widest hover:bg-accent/12'>{t}</span>
                            ))}
                        </div>
                        <a href="https://github.com/MidoLore/steam-stats" target="_blank" rel="noopener noreferrer" className='inline-block mt-6 text-lg tracking-widest text-accent hover:underline'>
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
                                        <span key={skill} className='border border-accent/25 px-3 py-1 text-lg tracking-widest hover:bg-accent/12'>
                            {skill}
                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Window>
                <Window
                    title="THEME"
                    isOpen={windows.theme}
                    onClose={() => closeWindow('theme')}
                    onFocus={() => setActiveWindow('theme')}
                    isActive={activeWindow === 'theme'}
                    width={600}
                    height={380}
                    offset={positions.theme}
                >
                    <ThemePicker />
                </Window>
            </div>

        </div>
    )
}

export default App