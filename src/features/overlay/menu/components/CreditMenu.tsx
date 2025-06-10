const CreditMenu = () => {
  return (
    <div className="text-center space-y-12 w-full">
      <div className="space-y-4">
        <p className="text-lg text-yellow-400">A Game By</p>
        <h2 className="text-4xl text-black">Lee Jaeyeop</h2>
      </div>

      <a
        className="space-y-3 break-words block"
        target="_blank"
        href="https://github.com/Leejaeyeop/typescript-guard-game"
      >
        <h3 className="text-2xl text-cyan-400">Github</h3>
        <p>https://github.com/Leejaeyeop/typescript-guard-game</p>
      </a>

      <div className="space-y-3">
        <h3 className="text-2xl text-cyan-400">Email</h3>
        <p>dlwodu1011@gmail.com</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl text-cyan-400">Powered By</h3>
        <p>Next.js & Vercel</p>
        <p>PixiJS</p>
        <p>Convex</p>
        <p>Zustand</p>
        <p>Tailwind CSS</p>
      </div>

      <div className="py-5">
        <h2 className="text-3xl text-black">Thank You For Playing!</h2>
      </div>
    </div>
  );
};

export default CreditMenu;
