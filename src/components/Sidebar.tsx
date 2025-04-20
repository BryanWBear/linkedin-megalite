import { BookmarkIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Card } from "./primitives/Card";
// This context will be used to share the scroll count between components
import { createContext, useContext } from "react";

// Create a context for the scroll count
const ScrollContext = createContext({
  scrolledPosts: 0,
  setScrolledPosts: (count: number) => {}
});

// This hook will be used in the main component to update the scroll count
export const useScrollContext = () => useContext(ScrollContext);

// Provider component to wrap around your app
export const ScrollProvider = ({ children }) => {
  const [scrolledPosts, setScrolledPosts] = useState(0);
  
  return (
    <ScrollContext.Provider value={{ scrolledPosts, setScrolledPosts }}>
      {children}
    </ScrollContext.Provider>
  );
};

const MyProfileHeader = () => {
  return (
    <div>
      <div
        className="bg-center bg-cover block h-14 w-full"
        style={{
          backgroundImage:
            "url(https://media.licdn.com/dms/image/C5616AQFBJ6o2Z7TrsQ/profile-displaybackgroundimage-shrink_200_800/0/1516968055361?e=1692835200&v=beta&t=MEqhkc8BTKOniiPx0Hphp_pXKJ-0GH6OWaaKLurI8Qc)",
        }}
      ></div>
      <div className="flex justify-center">
        <img
          className="w-16 h-16 rounded-full overflow-hidden border-white border-2 mt-[-32px] z-1"
          src="https://images.pexels.com/photos/1546912/pexels-photo-1546912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />
      </div>
    </div>
  );
};

const titles = [
  "Deadass Brokey",
  "Mama's Little Helper",
  "Assistant to the Regional Manager",
  "Beet Grower at Schrute Farms",
  "Professional Dogwalker",
  "Professional Dog",
  "Professional Doggystyler",
  "CEO of Bluechew",
  "Jeff Bezo's Wife",
  "Literally the President of America",
  "Enlightened God of LinkedIn",
];

const MyProfileProfession = () => {
  const { scrolledPosts } = useScrollContext();

  const titleIndex = Math.min(Math.floor(scrolledPosts / 10), titles.length - 1);
  const title = titles[titleIndex];

  return (
    <a
      className="flex justify-center items-center flex-col mt-4 pb-4 border-b border-slate-200"
      href="https://www.linkedin.com/in/ozgurgul35/"
      target="_blank"
    >
      <div className="text-md font-medium hover:underline cursor-pointer">
        Bryan Wang
      </div>
      <div className="text-xs text-zinc-500 mt-1">{title}</div>
    </a>
  );
};

const MyProfileStats: React.FC<{ text: string; count: number }> = ({
  text,
  count,
}) => {
  return (
    <div className="flex flex-row items-center text-xs font-semibold px-3 p-1 cursor-pointer hover:bg-zinc-200">
      <div className="w-full text-zinc-500">{text}</div>
      <div className="text-blue-600">{count}</div>
    </div>
  );
};

const MyItems: React.FC = () => {
  return (
    <div className="flex flex-row items-center text-xs font-semibold p-3 cursor-pointer hover:bg-zinc-200 text-zinc-600">
      <BookmarkIcon />
      <span className="ml-2">My items</span>
    </div>
  );
};

const Discover = () => {
  const discoverItem =
    "font-semibold text-blue-700 text-xs p-3 py-2 hover:underline";
  return (
    <Card className="pt-1 mt-2">
      <div className={discoverItem}>Groups</div>
      <div className={discoverItem}>Events</div>
      <div className={discoverItem}>Followed hashtags</div>
      <div className="border-t border-zinc-200 hover:bg-zinc-100 text-sm font-semibold text-zinc-500 p-3 text-center cursor-pointer transition-all">
        Discover more
      </div>
    </Card>
  );
};

const SidebarDesktopLayout = () => {
  const { scrolledPosts } = useContext(ScrollContext);
  return (
    <>
      <Card className="overflow-hidden">
        <MyProfileHeader />
        <MyProfileProfession />
        <div>
          <div className="py-3 border-b border-slate-200">
            <MyProfileStats text="Job Offers Recieved" count={scrolledPosts} />
          </div>
          <MyItems />
        </div>
      </Card>
      <div className="sticky top-16">
        <Discover />
      </div>
    </>
  );
};

const SidebarMobileLayout = () => {
  const [isShowingAllMobile, setShowingAllMobile] = useState(false);
  return (
    <>
      <Card className="overflow-hidden">
        <MyProfileHeader />
        <MyProfileProfession />
        {isShowingAllMobile && (
          <div>
            <div className="py-3 border-b border-slate-200">
              <MyProfileStats text="Who's viewed your profile" count={0} />
              <MyProfileStats text="Impressions of your post" count={0} />
            </div>
            <MyItems />
          </div>
        )}
      </Card>
      {isShowingAllMobile && <Discover />}
      <div
        className="flex text-zinc-500 font-semibold p-1 mt-2 hover:bg-zinc-200 cursor-pointer flex-row justify-center items-center text-sm"
        onClick={() => setShowingAllMobile(!isShowingAllMobile)}
      >
        {isShowingAllMobile ? (
          <>
            Show less <ChevronUp />
          </>
        ) : (
          <>
            Show more <ChevronDown />
          </>
        )}
      </div>
    </>
  );
};

export const Sidebar = () => {
  return (
    <div style={{ gridArea: "sidebar" }}>
      <div className="hidden sm:block sticky top-16 self-start h-fit">
        <SidebarDesktopLayout />
      </div>
      <div className="block sm:hidden">
        <SidebarMobileLayout />
      </div>
    </div>
  );
};
