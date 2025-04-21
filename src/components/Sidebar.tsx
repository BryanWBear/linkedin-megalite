import { Bookmark, Users, FileText, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState, createContext, useContext } from "react";
import { Card } from "./primitives/Card";
import headshot from "../assets/patrick_drool.jpg";

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

const ProfileHeader = () => {
  return (
    <div className="relative">
      <div className="bg-slate-300 h-16 w-full rounded-t-lg"></div>
      <div className="px-4 pb-4">
        <div className="relative">
          <img
            src={headshot}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 left-0"
          />
        </div>
        <div className="pt-14">
          <ProfileInfo />
        </div>
      </div>
    </div>
  );
};

const titles = [
  "Deadass Brokey",
  "Forex Trader",
  "Elon Glazer",
  "Assistant to the Regional Manager",
  "Professional Dogwalker",
  "Professional Dog",
  "Professional Doggystyler",
  "CEO of Bluechew",
  "Jeff Bezo's Wife",
  "Literally the President of America",
  "Enlightened God of LinkedIn",
];

const ProfileInfo = () => {
  const { scrolledPosts } = useScrollContext();
  const titleIndex = Math.min(Math.floor(scrolledPosts / 10), titles.length - 1);
  const title = titles[titleIndex];

  return (
    <div>
      <h2 className="text-xl font-bold">Me</h2>
      <p className="text-sm text-gray-600 mt-1">
        {title}
      </p>
    </div>
  );
};

const ProfileStats = () => {
  const { scrolledPosts } = useScrollContext();
  
  return (
    <div className="border-t border-gray-200 pt-3 pb-1 px-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">Profile viewers</p>
        <span className="text-blue-600 font-medium">{77 + scrolledPosts ** 3}</span>
      </div>
      <div className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
        View all analytics
      </div>
    </div>
  );
};

const PremiumPromo = () => {
  return (
    <div className="border-t border-gray-200 pt-3 px-4 pb-4">
      <p className="text-sm text-gray-600 mb-2">
        Subscribe to Premium or we will eat your soul
      </p>
      <div className="flex items-center">
        <div className="w-5 h-5 bg-amber-500 mr-2"></div>
        <p className="text-sm font-medium">Retry Premium for $1000</p>
      </div>
    </div>
  );
};

const SidebarItems = () => {
  const itemClass = "flex items-center p-3 text-sm font-medium hover:bg-gray-100 cursor-pointer";
  
  return (
    <div className="border-t border-gray-200">
      <div className={itemClass}>
        <Bookmark size={20} className="mr-3" />
        <span>Saved items</span>
      </div>
      <div className={itemClass}>
        <Users size={20} className="mr-3" />
        <span>Groups</span>
      </div>
      <div className={itemClass}>
        <FileText size={20} className="mr-3" />
        <span>Newsletters</span>
      </div>
      <div className={itemClass}>
        <Calendar size={20} className="mr-3" />
        <span>Events</span>
      </div>
    </div>
  );
};

const StatusCounter = () => {
  const { scrolledPosts } = useScrollContext();
  
  return (
    <Card className="mt-2 p-4">
      <p className="text-sm">Posts scrolled this session</p>
      <p className="text-2xl font-bold text-blue-600 mt-1">{scrolledPosts}</p>
      <div className="mt-2 text-xs text-gray-500">
        Scroll through more posts to take your career to new heights!
      </div>
    </Card>
  );
};

export const Sidebar = () => {
  return (
    <div style={{ gridArea: "sidebar" }}>
      <div className="hidden sm:block sticky top-4 self-start space-y-2">
        <Card className="overflow-hidden rounded-lg">
          <ProfileHeader />
          <ProfileStats />
          <PremiumPromo />
        </Card>
        <StatusCounter />
        <Card className="overflow-hidden rounded-lg">
          <SidebarItems />
        </Card>
      </div>
      
      <div className="block sm:hidden">
        <MobileSidebar />
      </div>
    </div>
  );
};

const MobileSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const { scrolledPosts } = useScrollContext();
  
  return (
    <div className="space-y-2">
      <Card className="overflow-hidden rounded-lg">
        <ProfileHeader />
        {expanded && (
          <>
            <ProfileStats />
            <PremiumPromo />
            <StatusCounter />
          </>
        )}
        <div 
          className="p-3 text-center text-gray-600 font-medium border-t border-gray-200 hover:bg-gray-100 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <div className="flex items-center justify-center">
              Show less <ChevronUp size={16} className="ml-1" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              Show more <ChevronDown size={16} className="ml-1" />
            </div>
          )}
        </div>
      </Card>
      {expanded && (
        <>
          <Card className="overflow-hidden rounded-lg">
            <SidebarItems />
          </Card>
        </>
      )}
    </div>
  );
};