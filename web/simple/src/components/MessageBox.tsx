'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type MessageBoxProps = React.ComponentPropsWithoutRef<'form'> & {
  onSay: (message: string) => void;
};

export function MessageBox({ className, onSay, ...rest }: MessageBoxProps) {
  const [message, setMessage] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSay(message);
    setMessage('');
  }

  return (
    <form className={twMerge('flex max-w-lg flex-1 rounded-md shadow-sm', className)} onSubmit={handleSubmit} {...rest}>
      <input
        className="block w-full rounded-none rounded-l-md border border-slate-700 bg-slate-800 px-3 py-2 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-sky-600"
        placeholder="What do you want the avatar to say?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
      />
      <button
        type="submit"
        className="-ml-px flex shrink-0 items-center rounded-r-md bg-sky-600 px-4 py-2 font-semibold text-white outline-none hover:bg-sky-500 focus:ring-1 focus:ring-sky-600"
      >
        Say
      </button>
    </form>
  );
}
