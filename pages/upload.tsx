import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useDebugValue, useEffect, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import useAuthStore from '../store/authStore'
import { client } from '../utils/client'
import { SanityAssetDocument } from '@sanity/client'
import { topics } from '../utils/constants'
import { BASE_URL } from '../utils'

interface IProps {}

const Upload = (props: IProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [videoAsset, setVideoAsset] = useState<
    SanityAssetDocument | undefined
  >()
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState(topics[0].name)
  const [savingPost, setSavingPost] = useState(false)

  const [wrongFileType, setWrongFileType] = useState(false)

  const { userProfile }: { userProfile: any } = useAuthStore()
  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0]
    const fileTypes: string[] = ['video/mp4', 'video/WebM', 'video/ogg']

    if (fileTypes.includes(selectedFile.type)) {
      client.assets
        .upload('file', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then(data => {
          setVideoAsset(data)
          setIsLoading(false)
          setWrongFileType(false)
        })
    } else {
      setIsLoading(false)
      setWrongFileType(true)
    }
  }

  const handlePost = async () => {
    if (caption && videoAsset?._id && category) {
      setSavingPost(true)

      const post = { caption, videoAsset, userProfile, category }

      await axios.post(`${BASE_URL}/api/post`, post)
      router.push('/')
    }
  }

  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#f8f8f8f] justify-center">
      <div className=" w-[50%] bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-between items-center p-14 pt-6">
        <div className="">
          <div className="">
            <p className="text-2xl font-bold">Upload Video</p>
            <p className="text-md text-gray-400 mt-1">
              Post Video to your Account
            </p>
          </div>
          <div
            className="
          border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100"
          >
            {isLoading ? (
              <p>Uploading</p>
            ) : (
              <div>
                {videoAsset ? (
                  <div>
                    <div>
                      <video
                        src={videoAsset.url}
                        loop
                        controls
                        className="rounded-xl h-[450px] mt-16 bg-black"
                      ></video>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer ">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center justify-center ">
                        <p>
                          <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                        </p>
                        <p className="text-xl font-semibold">Upload Video</p>
                      </div>
                      <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                        MP4, WebM or ogg <br />
                        720px1280 or heigher <br />
                        Up to 10 minutes <br />
                        Up to 2GB
                      </p>
                      <p className="bg-[#f51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none">
                        Select Video
                      </p>
                    </div>
                    <input
                      type="file"
                      name="upload-video"
                      className="w-0 h-0"
                      onChange={uploadVideo}
                    />
                  </label>
                )}
              </div>
            )}
            {wrongFileType && (
              <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[250px]">
                {' '}
                Please Select a Video file
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 pb-10">
          <label className="text-md font-medium"> Caption </label>
          <input
            className="rounded outline-none text-md border-2 border-gray-200 p-2"
            type="text"
            value={caption}
            onChange={(e: any) => {
              setCaption(e.target.value)
            }}
          />
          <label className="text-md font-medium"> Choose a Category </label>
          <select
            className="outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
            onChange={(e: any) => {
              setCategory(e.target.value)
            }}
          >
            {topics.map(topic => (
              <option
                className="outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
                key={topic.name}
                value={topic.name}
              >
                {topic.name}
              </option>
            ))}
          </select>
          <div className="flex gap-6 mt-10">
            <button
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
              onClick={() => {}}
              type="button"
            >
              Discard
            </button>
            <button
              className="bg-[#f51977] text-white  text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
              onClick={handlePost}
              type="button"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
