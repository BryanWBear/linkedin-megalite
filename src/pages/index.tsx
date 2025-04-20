import { Aside } from "src/components/Aside";
import { ChatBox } from "src/components/ChatBox";
import { Header } from "src/components/Header";
import { Main } from "src/components/Main";
import { Sidebar, ScrollProvider } from "src/components/Sidebar";

export default function Home() {
  return (
    <>
      <ScrollProvider>
      <Header />
      <div className="pt-4 grid gap-6" id="index-grid">
        <Sidebar />
        <Main />
        <Aside />
      </div>
      <ChatBox />
      </ScrollProvider>
    </>
  );
}
