import { Rnd } from 'react-rnd'

function Window( {isOpen, onClose} ) {
    const x = window.innerWidth / 2 - 450;
    const y = window.innerHeight / 2 - 300;

    if (!isOpen) return null;

    return (
        <Rnd
            default={{ x, y, width: 900, height: 600 }}
            bounds="window"
            style={{display: isOpen ? 'block' : 'none'}}
        >
            <div className='rounded-t-2xl rounded-b-2xl border-2 border-cyan-400 bg-gray-900 w-full h-full'>
                <div className='rounded-t-2xl bg-gray-800 p-4 text-cyan-400 text-xs flex items-center justify-between'>
                    <h1 className='text-2xl'>Test</h1>
                    <div className='flex items-center gap-2'>
                        <button onClick={onClose} className='w-7 h-7 rounded-md bg-gray-900 border border-cyan-400 hover:bg-cyan-400 hover:text-gray-900 flex items-center justify-center text-cyan-400 text-lg font-bold leading-none'>✖</button>
                    </div>
                </div>
            </div>
        </Rnd>
    )
}

export default Window