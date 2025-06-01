import App from "./(pixijs)/App";
import { MAX_SIZE } from "./(pixijs)/constants/sizes";
export default function Home() {
  return (
    <main className="w-screen h-screen flex items-center justify-center flex-col bg-black">
      <div
        className={`flex-grow w-full h-full flex flex-col items-center justify-center`}
        style={{
          maxWidth: MAX_SIZE + "px",
          maxHeight: MAX_SIZE + "px",
        }}
      >
        <App />
      </div>
    </main>
  );
}
