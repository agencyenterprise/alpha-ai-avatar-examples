import { twMerge } from 'tailwind-merge';

export type AudioPlaybackWarningProps = React.ComponentPropsWithoutRef<'div'> & {
  onConfirm: () => void;
};

export function AudioPlaybackWarning({ className, onConfirm, ...rest }: AudioPlaybackWarningProps) {
  return (
    <div className={twMerge('absolute inset-0 flex items-center justify-center bg-black/50 p-4', className)} {...rest}>
      <div className="flex max-w-md flex-col items-center gap-4 rounded-lg bg-slate-900 px-8 py-4">
        <p className="text-lg font-bold">Allow audio playback</p>
        <p>Some browsers prevent websites from playing audio/video automatically, we need explicit user input.</p>
        <p>If your application already requires user input in order to connect to the room you might not need this.</p>
        <button
          type="button"
          className="items-center rounded-md bg-sky-600 px-4 py-2 font-semibold text-white outline-none hover:bg-sky-500 focus:ring-1 focus:ring-sky-600"
          onClick={onConfirm}
        >
          Yes
        </button>
      </div>
    </div>
  );
}
