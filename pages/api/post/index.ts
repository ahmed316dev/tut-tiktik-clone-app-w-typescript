// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../../utils/client'
import { allPostsQuery } from '../../../utils/queries'

type Data = {
  name: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const query = allPostsQuery()
    const data = await client.fetch(query)
    res.status(200).json(data)
  } else if (req.method === 'POST') {
    const { caption, videoAsset, userProfile, category } = req.body

    const document = {
      _type: 'post',
      caption,
      video: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: videoAsset?._id,
        },
      },
      userId: userProfile?._id,
      postedBy: {
        _type: 'postedBy',
        _ref: userProfile?._id,
      },
      topic: category,
    }

    client.create(document).then(() => res.status(201).json('Video Created'))
  }
}

export default handler
