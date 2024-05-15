import { useEffect, useState } from 'react';

function useIsMobile() {
  const MOBILE_CUTOFF = 600;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_CUTOFF);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default useIsMobile;
