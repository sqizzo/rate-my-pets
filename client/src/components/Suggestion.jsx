import React from "react";

const Suggestion = ({ suggestion }) => (
  <div className="flex items-center my-3">
    <img
      src={suggestion.avatar}
      alt={suggestion.user}
      className="w-10 h-10 rounded-full"
    />
    <div className="ml-3 flex-grow">
      <p className="font-bold text-sm">{suggestion.user}</p>
      <p className="text-gray-500 text-xs">{suggestion.followedBy}</p>
    </div>
    <button className="text-blue-400 font-bold text-xs">Follow</button>
  </div>
);

export default Suggestion;
