import React from 'react'
import { CiBookmark } from "react-icons/ci";

function WatchLaterBtn() {
  return (
    <div>
      <button className="bg-neutral-800 font-medium border border-gray-600 rounded-2xl lg:text-base py-3 px-4 text-white w-40 flex items-center justify-center space-x-2">
            <CiBookmark className="lg:text-xl" />
            <span>Watch Later</span>
          </button>
    </div>
  )
}

export default WatchLaterBtn
