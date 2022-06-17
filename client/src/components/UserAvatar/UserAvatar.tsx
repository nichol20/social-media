import Image, { StaticImageData } from 'next/image'
import React from 'react'

import defaultImage from '../../../public/default.png'

interface UserAvatarProps {
  width: string
  height: string
  image: StaticImageData | string | undefined
}

export const UserAvatar = ({ width, height, image }: UserAvatarProps) => {
  
  return (
    <div className='user_avatar-component' style={{ width, height }} >
      <Image src={image ?? defaultImage} alt='user' width={width} height={height} objectFit={'cover'} />
    </div>
  )
}