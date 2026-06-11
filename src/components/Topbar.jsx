import { useState, useEffect } from 'react'

function Topbar() {
    const [time, setTime] = useState('')

    useEffect(() => {
        function updateTime() {
            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            setTime(hours + ":" + minutes);
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    })
    return (
        <div className='flex justify-between items-center px-4 py-3 border-b border-[#00ffc840] bg-[#00102880] font-mono '>
            <span className='text-[#00ffc8] text-xs tracking-widest'>
                MIDO.OS v1.0
            </span>
            <span className='text-[#00ffc8] text-xs'>
                {time} - Oslo, NO
            </span>
        </div>
    )
}
export default Topbar