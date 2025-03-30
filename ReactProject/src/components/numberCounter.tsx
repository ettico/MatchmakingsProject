import  { useState } from 'react';
import '../css/home.css'
const NumberCounter = ({ targetNumber }:any) => {
    const [count, setCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    const handleMouseEnter = () => {
        setIsCounting(true);
        let currentCount = 100;
        const interval = setInterval(() => {
            if (currentCount < targetNumber) {
                currentCount+=50;
                setCount(currentCount);
            } else {
                clearInterval(interval);
                setIsCounting(false);
            }
        }, 50); // מהירות הספירה
    };

    return (
        <div className="counter" onMouseEnter={handleMouseEnter}>
            <div className="icon">
               
            </div>
            <div className="number">+{isCounting ? count : targetNumber}</div>
        </div>
    );
};

export default NumberCounter;
