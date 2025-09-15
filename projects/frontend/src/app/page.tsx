import { Navbar } from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">
        <p className="mt-4 text-center text-lg">Welcome to WeGoEveryWhere!</p>
        <h1 className="flex flex-col items-center text-[150px] font-bold">
          <span>H</span>
          <span>O</span>
          <span>M</span>
          <span>E</span>
        </h1>
        <p className="mt-4 text-center text-lg">Welcome to WeGoEveryWhere!</p>
      </main>
      <Navbar />
    </div>
  );
}
