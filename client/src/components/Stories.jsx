import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StoryCircle from "./StoryCircle";

const Stories = () => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 300, behavior: "smooth" });
    }
  };

  const storiesData = [
    {
      id: 1,
      user: "badgurl",
      avatar: "https://placehold.co/64x64/F4D03F/000000?text=BG",
    },
    {
      id: 2,
      user: "samuel",
      avatar: "https://placehold.co/64x64/1ABC9C/FFFFFF?text=S",
    },
    {
      id: 3,
      user: "pangea",
      avatar: "https://placehold.co/64x64/3498DB/FFFFFF?text=P",
    },
    {
      id: 4,
      user: "loony",
      avatar: "https://placehold.co/64x64/9B59B6/FFFFFF?text=L",
    },
    {
      id: 5,
      user: "murrmay",
      avatar: "https://placehold.co/64x64/E74C3C/FFFFFF?text=M",
    },
    {
      id: 6,
      user: "gigiB",
      avatar: "https://placehold.co/64x64/E67E22/FFFFFF?text=GB",
    },
    {
      id: 7,
      user: "indie",
      avatar: "https://placehold.co/64x64/5DADE2/000000?text=I",
    },
    {
      id: 8,
      user: "chris",
      avatar: "https://placehold.co/64x64/AF7AC5/FFFFFF?text=C",
    },
    {
      id: 9,
      user: "diana",
      avatar: "https://placehold.co/64x64/F1948A/000000?text=D",
    },
  ];

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex items-center space-x-4 p-4 bg-black border-b border-gray-700 overflow-x-auto scrollbar-hide"
      >
        {storiesData.map((story) => (
          <StoryCircle key={story.id} {...story} />
        ))}
      </div>
      <button
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 text-black z-10 hover:bg-white"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 text-black z-10 hover:bg-white"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Stories;
