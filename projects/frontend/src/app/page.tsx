import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  await new Promise((resolve) => setInterval(resolve, 1000));
  return (
    <>
      <div style={{ justifyContent: "center", display: "flex" }}>Home Page</div>
    </>
  );
}
