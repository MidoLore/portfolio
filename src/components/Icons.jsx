function Icons({onClick, title, icon}) {

    return (
        <>
            <button onClick={onClick} className='flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-[#00ffc810] group'>
                <div className='w-16 h-16 rounded-lg border border-[#00ffc840] bg-[#00102880] flex items-center justify-center text-3xl group-hover:border-[#00ffc8]'>
                    {icon}
                </div>
                <span className='text-sm tracking-widest'>{title}</span>
            </button>
        </>
    )
}
export default Icons