import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import useIsMobile from '@/hooks/useIsMobile';

import type { ChatRequestMessage } from '@/hooks/useChatGPT';

export const ChatWindow = ({ chatHistory }: { chatHistory: ChatRequestMessage[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  const messages = [...chatHistory];

  if (isMobile) {
    return null; // can do floating chat here if we want to support mobile
  }

  return (
    <div
      ref={scrollContainerRef}
      className="hide-scrollbar flex h-full w-full flex-1 flex-col gap-4 overflow-y-scroll bg-overlay pb-12 pt-4"
    >
      {messages.map((msgObj, index) => {
        const isUser = msgObj.role === 'user';
        return (
          <div
            key={index}
            className={twMerge('relative flex', isUser ? 'flex-row-reverse pl-6 pr-3' : 'flex-row pl-3 pr-6')}
          >
            <div className={twMerge('w-fit rounded-lg', isUser ? 'bg-primary-box' : 'bg-gray-100')}>
              <p
                className={twMerge(
                  'w-fit px-3 py-2 text-base leading-6',
                  isUser ? 'text-primary-box-text' : 'text-secondary-box-text',
                )}
              >
                {msgObj.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
