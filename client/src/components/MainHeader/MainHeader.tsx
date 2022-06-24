import Image from 'next/image'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useContext } from 'react'

import searchIcon from '../../../public/search.svg'
import { AuthContext } from '../../Contexts/AuthContext'
import { UserAvatar } from '../UserAvatar/UserAvatar'

interface MainHeaderProps {
  setQuery: Dispatch<SetStateAction<string>>
}

export const MainHeader = ({ setQuery }: MainHeaderProps) => {
  const { user, signOut } = useContext(AuthContext)

  return (
    <header className='main_header-component'>
      <Link href='/'><a className='social_media-logo'>Social Media</a></Link>

      <div className='search_bar-box'>
        <input
         type='text' 
         placeholder='search for post' 
         onChange={e => setQuery(e.target.value.toLocaleLowerCase())} 
        />
        <div className='image-box'>
          <Image src={searchIcon} alt='search icon'/>
        </div>
      </div>

      <div className='main_header-options-box'>
        <UserAvatar width='35px' height='35px' image={user?.image} />

        <div className='main_header-options-submenu-container'>
          <ul className='main_header-options-submenu-list'>
            <li><a onClick={signOut}>Log out</a></li>
          </ul>
        </div>
      </div>
    </header>
  )
}