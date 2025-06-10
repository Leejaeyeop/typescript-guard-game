const CreditMenu = () => {
  return (
    <article
      className="text-center space-y-12 w-full"
      aria-labelledby="credit-menu"
    >
      <h1
        id="credit-menu-heading"
        className="text-xl font-extrabold text-black"
      >
        Credit
      </h1>
      <div className="space-y-4">
        <p className="text-lg text-yellow-400">A Game By</p>
        <h2 className="text-4xl text-black">Lee Jaeyeop</h2>
      </div>

      <a
        className="space-y-3 break-words block"
        target="_blank"
        href="https://github.com/Leejaeyeop/typescript-guard-game"
        rel="noopener noreferrer"
      >
        <h3 className="text-2xl text-cyan-400">Github</h3>
        <p>https://github.com/Leejaeyeop/typescript-guard-game</p>
        <span className="sr-only">(Open new tab)</span>
      </a>

      <div className="space-y-3">
        <h3 className="text-2xl text-cyan-400">Email</h3>
        <a
          href="mailto:dlwodu1011@gmail.com"
          className="block text-black hover:underline"
        >
          dlwodu1011@gmail.com
        </a>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl text-cyan-400">Powered By</h3>
        <ul className="space-y-1">
          <li>Next.js & Vercel</li>
          <li>PixiJS</li>
          <li>Convex</li>
          <li>Zustand</li>
          <li>Tailwind CSS</li>
        </ul>
      </div>

      <div className="py-5">
        <h2 className="text-3xl text-black">Thank You For Playing!</h2>
      </div>
    </article>
  );
};

export default CreditMenu;
