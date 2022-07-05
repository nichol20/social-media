import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'

import defaultImage from '../../../public/default.png'

interface UserAvatarProps {
  width: string
  height: string
  image: StaticImageData | string
  userId: string
}

export const UserAvatar = ({ width, height, image, userId }: UserAvatarProps) => {
  
  return (
    <Link href={`/users/${userId}`}>
      <div className='user_avatar-component' style={{ width, height }} >
          <Image src={image ?? defaultImage} alt='user' width={width} height={height} objectFit={'cover'} />
      </div>
    </Link>
  )
}