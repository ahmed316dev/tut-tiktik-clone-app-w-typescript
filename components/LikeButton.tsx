import React, { useEffect, useState } from 'react'
import { MdFavorite } from 'react-icons/md'
import useAuthStore from '../store/authStore'
import { userLikedPostsQuery } from '../utils/queries'

interface IProps {
  likes: any[]
  handleLike: () => void
  handleDislike: () => void
}

const LikeButton = ({ likes, handleLike, handleDislike }: IProps) => {
  const [alreadyLiked, setalreadyLiked] = useState(false)
  const { userProfile }: any = useAuthStore()
  const filterLikes = likes?.filter(item => item?._ref === userProfile?._id)
  useEffect(() => {
    if (filterLikes?.length) {
      setalreadyLiked(true)
    } else {
      setalreadyLiked(false)
    }
  }, [likes, filterLikes])

  return (
    <div className="flex gap-6">
      <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
        {alreadyLiked ? (
          <div
            className="bg-primary rounded-full p-2 md:p-4 text-[#F51977]"
            onClick={() => handleDislike()}
          >
            <MdFavorite className="text-lg md:text-2xl" />
          </div>
        ) : (
          <div
            className="bg-primary rounded-full p-2 md:p-4 "
            onClick={() => handleLike()}
          >
            <MdFavorite className="text-lg md:text-2xl" />
          </div>
        )}
        <p className="text-md font-semibold"> {likes?.length || 0}</p>
      </div>
    </div>
  )
}

export default LikeButton
