import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { GoVerified } from 'react-icons/go'
import NoResults from '../../components/NoResults'
import VideoCard from '../../components/VideoCard'
import { IUser, Video } from '../../types'
import { BASE_URL } from '../../utils'

interface IProps {
  data: {
    user: IUser
    userVideos: Video[]
    userLikedVideos: Video[]
  }
}

const Profile = ({ data }: IProps) => {
  const { user, userVideos, userLikedVideos } = data

  const [showUserVideos, setShowUserVideos] = useState(true)
  const [videosList, setVideosList] = useState<Video[]>([])

  const videos = showUserVideos ? 'border-b-2 border-black' : 'text-gray-400'
  const liked = !showUserVideos ? 'border-b-2 border-black' : 'text-gray-400'

  useEffect(() => {
    if (showUserVideos) {
      setVideosList(userVideos)
    } else {
      setVideosList(userLikedVideos)
    }
  }, [userVideos, userLikedVideos, showUserVideos])

  return (
    <div className="w-full">
      <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
        <div className="w-16 h-16 md:w-32 md:h-32">
          <Image
            src={user.image}
            alt="user profile"
            width={120}
            height={120}
            className="rounded-full "
            layout="responsive"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="flex gap-1 items-center justify-center text-md font-bold text-primary lowercase md:text-2xl tracking-wider">
            {user?.userName?.replace(' ', '')}
            <GoVerified className="text-blue-400" />
          </p>
          <p className=" capitalized text-gray-400 text-xs md:text-xl">
            {user?.userName}
          </p>
        </div>
      </div>
      <div className="">
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p
            className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>
        <div className="flex gap-6 flex-wrap md:justify-start">
          {videosList.length ? (
            videosList.map((video: Video) => (
              <VideoCard post={video} key={video._id} />
            ))
          ) : (
            <div className="">
              <NoResults
                text={`No ${showUserVideos ? '' : 'liked'} videos yet`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/profile/${id}`)
  return {
    props: {
      data,
    },
  }
}

export default Profile
