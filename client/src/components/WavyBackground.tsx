export function WavyBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cyan-400/20 to-transparent" />
      <div className="absolute inset-0 -z-10 overflow-hidden translate-z-0">
        <div
          className="relative left-1/2 aspect-[1155/678] w-72 sm:w-[1154px] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-900 to-cyan-500 opacity-30 animate-wave-float"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
