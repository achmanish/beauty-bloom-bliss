import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface FlashSaleTimerProps {
  endDate: string;
  onExpire?: () => void;
}

const FlashSaleTimer = ({ endDate, onExpire }: FlashSaleTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(endDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, expired: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        onExpire?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-2 text-red-600 font-medium">
        <Clock className="h-4 w-4" />
        <span>Sale Ended</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-red-600" />
      <div className="flex items-center gap-1 text-sm font-medium">
        <span className="text-red-600">Ends in:</span>
        {timeLeft.days > 0 && (
          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
            {timeLeft.days}d
          </span>
        )}
        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
          {timeLeft.hours.toString().padStart(2, '0')}h
        </span>
        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
          {timeLeft.minutes.toString().padStart(2, '0')}m
        </span>
        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
          {timeLeft.seconds.toString().padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
};

export default FlashSaleTimer;