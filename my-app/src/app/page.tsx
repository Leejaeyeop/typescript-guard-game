import App from "./(pixijs)/App";

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col bg-black">
      <div className="w-full max-w-5xl h-screen flex flex-col items-center justify-center">
        <App />
        <div className="border-4 border-white p-4 w-full max-w-5xl h-32">
          <h1>Our Type</h1>
          <p>type Foo = string</p>
        </div>
      </div>
    </main>
  );
}
