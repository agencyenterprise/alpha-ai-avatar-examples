import { useEffect, useState } from 'react';

export function useMic() {
  const [hasMicAccess, setHasMicAccess] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
      setHasMicAccess(true);
    });
  }, []);

  return { hasMicAccess };
}
