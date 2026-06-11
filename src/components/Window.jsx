import { Rnd } from 'react-rnd'

function Window({ isOpen, onClose }) {
    const x = window.innerWidth / 2 - 450;
    const y = window.innerHeight / 2 - 300;

    if (!isOpen) return null;

    return (
        <Rnd
            default={{ x, y, width: 900, height: 600 }}
            bounds="#desktop"
            minHeight={240}
            minWidth={300}
        >
            <div className='w-full h-full rounded-2xl border border-[#00ffc840] bg-[#0a0f1e] '>
                <div className='rounded-t-2xl bg-[#00102880] px-4 py-3 flex items-center justify-between border-b border-[#00ffc840]'>
                    <h1 className='text-[#00ffc8] text-xl tracking-widest '>Home</h1>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={onClose}
                            className='w-6 h-6 rounded border border-[#00ffc840] text-[#00ffc8] bg-transparent hover:bg-[#00ffc820] flex items-center justify-center text-xs leading-none'
                        >
                            ✖
                        </button>
                    </div>
                </div>
            </div>
        </Rnd>
    )
}

export default Window