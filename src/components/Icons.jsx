function Icons({onClick, title, icon}) {

    return (
        <>
            <button onClick={onClick}    className='flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-accent/15 hover:text-accent group'>
                <div className='w-25 h-25 flex items-center justify-center text-3xl group-hover:border-accent'>
                    {icon}
                </div>
                <span className='text-sm tracking-widest'>{title}</span>
            </button>
        </>
    )
}
export default Icons
