import { Rnd } from 'react-rnd'

function Window({ isOpen, onClose, title, children, onFocus, isActive, width, height}) {
    const x = window.innerWidth / 2 - 450;
    const y = window.innerHeight / 2 - 300;

    if (!isOpen) return null;

    return (
        <Rnd
            default={{ x, y, width: width, height: height }}
            bounds="#desktop"
            minHeight={240}
            minWidth={300}
            onMouseDown={onFocus}
            style={{ zIndex: isActive ? 10 : 1 }}
        >
            <div className='w-full h-full rounded-2xl border border-[#00ffc840] bg-[#0a0f1e] '>
                <div className='rounded-t-2xl bg-[#00102880] px-4 py-3 flex items-center justify-between border-b border-[#00ffc840]'>
                    <h1 className='text-xl tracking-widest '>{title}</h1>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={onClose}
                            className='w-6 h-6 rounded border border-[#00ffc840] bg-transparent hover:bg-[#00ffc820] flex items-center justify-center text-xs leading-none'
                        >
                            ✖
                        </button>
                    </div>
                </div>
                {children}
            </div>
        </Rnd>
    )
}

export default Window