import React from "react";

const StoryCircle = ({ avatar, user }) => (
  <div className="flex flex-col items-center space-y-1 cursor-pointer">
    <div className="bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-0.5 rounded-full">
      <div className="bg-black rounded-full p-0.5">
        <img
          className="w-16 h-16 rounded-full"
          src={avatar}
          alt={`${user}'s story`}
        />
      </div>
    </div>
    <span className="text-xs text-gray-300">
      {user.length > 9 ? user.substring(0, 8) + "..." : user}
    </span>
  </div>
);

export default StoryCircle;
