import { useState, useEffect } from 'react'

function Topbar() {
    const [time, setTime] = useState('')

    useEffect(() => {
        function updateTime() {
            const date = new Date();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            setTime(hours + ":" + minutes);
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    })
    return (
        <div className='flex justify-between items-center px-4 py-3 border-b border-[#00ffc840] bg-[#00102880]'>
            <span className='text-[#00ffc8] text-xl tracking-widest '>
                MIDO.OS v1.0
            </span>
            <span className='text-[#00ffc8] text-xl'>
                {time} - Oslo, NO
            </span>
        </div>
    )
}
export default Topbar