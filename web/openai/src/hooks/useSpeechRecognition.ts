import { useCallback, useRef, useState } from 'react';

import { AzureSpeechRecognition } from '@/app/services/AzureSpeechRecognition';

export type UseSpeechRecognitionOptions = {
  onSpeechRecognized: (transcript: string) => void;
};

export function useSpeechRecognition({ onSpeechRecognized }: UseSpeechRecognitionOptions) {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef<AzureSpeechRecognition>(new AzureSpeechRecognition());

  const startRecognizing = useCallback(async () => {
    setIsRecognizing(true);

    await recognitionRef.current.start(onSpeechRecognized);
  }, [onSpeechRecognized]);

  const stopRecognizing = useCallback(async () => {
    setIsRecognizing(false);
    recognitionRef.current.stop();
  }, []);

  return { isRecognizing, startRecognizing, stopRecognizing };
}
