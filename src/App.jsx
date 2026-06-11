import Window from './components/Window'
import {useState} from "react";

function App() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className='w-screen h-screen bg-gray-950'>
            <Window isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>

    )
}

export default App