import { Rnd } from 'react-rnd'

function Window({ title, children }) {
    const x = window.innerWidth / 2 - 450;
    const y = window.innerHeight / 2 - 300;
    return (
        <Rnd
            default={{ x, y, width: 900, height: 600 }}
            //disableDragging={true}
            enableResizing={false}
            bounds="window"
        >
            <div className='rounded-t-2xl rounded-b-2xl border-2 border-cyan-400 bg-gray-900 w-full h-full'>
                <div className='rounded-t-2xl bg-gray-800 p-4 text-cyan-400 text-xs'>
                    <h1 className='text-2xl'>Home</h1>
                </div>
                <div className='p-4'>
                    {children}
                </div>
            </div>
        </Rnd>
    )
}

export default Window