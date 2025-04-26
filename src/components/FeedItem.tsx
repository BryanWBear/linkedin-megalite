import { UserAvatar } from "./UserAvatar";
import {
  ArrowLeftRight,
  LightbulbIcon,
  MessageSquareIcon,
  SendIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Card } from "./primitives/Card";

type FeedItemProps = {
  type: "post";
  content?: string;
  thumbnail?: string;
  link?: {
    thumbnail?: string;
    title?: string;
    href?: string;
  };
  author: {
    name: string;
    subtext: string;
    imageUrl: string;
    connectionDegree: string;
  };
  stats?: {
    likes?: number;
    comments?: number;
    reposts?: number;
  };
};

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

const LikesCountRow: React.FC<{ stats: FeedItemProps["stats"] }> = ({
  stats,
}) => {
  if (!stats) {
    return null;
  }
  return (
    <div className="text-zinc-500 text-xs p-2 px-4 flex flex-row items-center border-b">
      {stats.likes && (
        <div className="w-full flex flex-row items-center hover:text-blue-600 hover:underline cursor-pointer">
          <LightbulbIcon size={15} />
          <span className="ml-1">{stats.likes}</span>
        </div>
      )}
      {stats.comments && (
        <div className="hover:text-blue-600 hover:underline cursor-pointer shrink-0">
          {stats.comments} comments
        </div>
      )}
      {stats.reposts && (
        <div className="hover:text-blue-600 hover:underline cursor-pointer shrink-0 ml-2">
          <span className="mr-1 text-muted-foreground">•</span> {stats.reposts}{" "}
          reposts
        </div>
      )}
    </div>
  );
};

const Action: React.FC<{ text: string; icon: any }> = ({ text, icon }) => {
  return (
    <div className="p-2 rounded hover:bg-zinc-200 flex flex-row text-zinc-500 text-sm items-center cursor-pointer transition-all">
      <span>{icon}</span>
      <span className="font-semibold ml-2 hidden sm:inline">{text}</span>
    </div>
  );
};

const ActionsRow = () => {
  return (
    <div className="flex flex-row justify-between items-center py-2 px-4">
      <Action text="Like" icon={<ThumbsUpIcon />} />
      <Action text="Comment" icon={<MessageSquareIcon />} />
      <Action text="Repost" icon={<ArrowLeftRight />} />
      <Action text="Send" icon={<SendIcon />} />
    </div>
  );
};

const renderContentWithFormatting = (text: string) => {
  if (!text) return null;
  
  // Regex patterns for different clickable elements
  const hashtagRegex = /#(\w+)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  return text.split("\n").map((line, i) => {
    // First, split by URLs
    let elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let urlMatch;
    
    const tempLine = line + " "; // Add space to handle URLs at the end of line
    
    while ((urlMatch = urlRegex.exec(tempLine)) !== null) {
      // Add text before URL
      if (urlMatch.index > lastIndex) {
        const textBeforeUrl = tempLine.substring(lastIndex, urlMatch.index);
        
        // Process hashtags in text before URL
        const textParts = textBeforeUrl.split(hashtagRegex);
        textParts.forEach((part, index) => {
          if (index % 2 === 1) {
            // This is the hashtag
            elements.push(
              <a
                key={`hash-${i}-${index}-${elements.length}`}
                href={`https://www.linkedin.com/feed/hashtag/${part}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                #{part}
              </a>
            );
          } else if (part) {
            elements.push(<span key={`text-${i}-${index}-${elements.length}`}>{part}</span>);
          }
        });
      }
      
      // Add URL as clickable link
      const url = urlMatch[0];
      elements.push(
        <a
          key={`url-${i}-${elements.length}`}
          href={url}
          className="text-blue-600 hover:underline break-words"
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
      );
      
      lastIndex = urlMatch.index + url.length;
    }
    
    // Add remaining text after last URL
    if (lastIndex < line.length) {
      const remainingText = line.substring(lastIndex);
      
      // Process hashtags in remaining text
      const textParts = remainingText.split(hashtagRegex);
      textParts.forEach((part, index) => {
        if (index % 2 === 1) {
          // This is the hashtag
          elements.push(
            <a
              key={`hash-end-${i}-${index}-${elements.length}`}
              href={`https://www.linkedin.com/feed/hashtag/${part}`}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              #{part}
            </a>
          );
        } else if (part) {
          elements.push(<span key={`text-end-${i}-${index}-${elements.length}`}>{part}</span>);
        }
      });
    }
    
    return (
      <p key={i} className="mb-2 whitespace-pre-wrap break-words">
        {elements}
      </p>
    );
  });
};

export const FeedItem: React.FC<FeedItemProps> = ({
  type,
  content,
  thumbnail,
  link,
  author,
  stats,
}) => {
  return (
    <Card className="p-0 mt-2">
      <div className="flex flex-row p-4">
        <UserAvatar imageUrl={author.imageUrl} />
        <div className="pl-4">
          <div className="flex flex-row items-center">
            <div className="font-semibold">{author.name}</div>
            <div className="ml-2 text-muted-foreground text-sm">
              • {author.connectionDegree}
            </div>
          </div>
          <div className="text-xs text-zinc-500">{author.subtext}</div>
        </div>
      </div>

      <div className="p-4 text-sm pt-0">
        {content ? renderContentWithFormatting(content) : null}
      </div>

      {thumbnail && <img src={thumbnail} alt="Post thumbnail" className="w-full h-auto" />}
      
      {link && link.href && (
        <a 
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          {link.thumbnail && <img src={link.thumbnail} alt={link.title || "Linked content"} className="w-full h-auto" />}
          <div className="p-4 bg-slate-200">
            <div className="text-sm font-semibold hover:underline">{link.title}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {link.href && extractDomain(link.href)}
            </div>
          </div>
        </a>
      )}
      
      <LikesCountRow stats={stats} />
      <ActionsRow />
    </Card>
  );
};