import Window from './components/Window'
import {useState} from "react";
import Topbar from "./components/Topbar.jsx";

function App() {
    const [isOpen, setIsOpen] = useState(true);

    return (

        <div className='w-screen h-screen bg-[#0a0f1e] flex flex-col'>
            <div className='z-100 relative'>
                <Topbar />
            </div>
            <div
                id="desktop"
                className='relative flex-1'
                style={{
                    backgroundImage: `
            linear-gradient(#00ffc808 1px, transparent 1px),
            linear-gradient(90deg, #00ffc810 1px, transparent 1px)
        `,
                    backgroundSize: '20px 20px'
                }}
            >
                <Window isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </div>
        </div>

    )
}

export default App