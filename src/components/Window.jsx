import { Rnd } from 'react-rnd'

function Window({ isOpen, onClose, title, children, onFocus, isActive, width, height, offset }) {
    if (!isOpen) return null;

    const x = window.innerWidth / 2 - width / 2 + (offset?.x ?? 0);
    const y = window.innerHeight / 2 - height / 2 + (offset?.y ?? 0);

    return (
        <Rnd
            default={{ x, y, width: width, height: height }}
            bounds="#desktop"
            minHeight={240}
            minWidth={300}
            onMouseDown={onFocus}
            style={{ zIndex: isActive ? 10 : 1 }}
        >
            <div className='w-full h-full rounded-2xl border border-accent/25 bg-bg '>
                <div className='rounded-t-2xl bg-surface/50 px-4 py-3 flex items-center justify-between border-b border-accent/25'>
                    <h1 className='text-xl tracking-widest '>{title}</h1>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={onClose}
                            className='w-6 h-6 rounded border border-accent/25 bg-transparent hover:bg-accent/12 flex items-center justify-center text-xs leading-none'
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
