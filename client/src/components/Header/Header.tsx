import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import searchIcon from '../../../public/search.svg'
import testImage from '../../../public/test_image.png'

export const Header = () => {
  return (
    <header className='main_header'>
      <Link href='/'><a className='social_media-logo'>Social Media</a></Link>

      <div className='search_bar-box'>
        <input type='text' placeholder='search for post' />
        <div className='image-box'>
          <Image src={searchIcon} alt='search icon'/>
        </div>
      </div>

      <div className='user_avatar'>
        <div className='image-box'>
          <Image src={testImage} alt='user' />
        </div>

        <div className='user_avatar-submenu-container'>
          <ul className='user_avatar-submenu-list'>
            <li><Link href='/login'><a>Log out</a></Link></li>
          </ul>
        </div>
      </div>
    </header>
  )
}