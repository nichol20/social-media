import type { GetServerSideProps, NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'

import { Feed } from '../components/Feed/Feed'
import { MainHeader } from '../components/MainHeader/MainHeader'
import { AuthContext, User } from '../Contexts/AuthContext'
import { withAuth } from '../utils/withAuth'

interface HomeProps {
  userData: User
}

const Home: NextPage<HomeProps> = ({ userData }) => {
  const { user, setUser } = useContext(AuthContext)
  const [ query, setQuery ] = useState('')

  useEffect(() =>  setUser(userData), [ setUser, userData ])

  if(!user) return <>Loading...</>

  return (
    <div className='social_media_app-home'>
      <MainHeader setQuery={setQuery} />
      <Feed query={query} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async context => {
    return {
      props: {}
    }
  }
)

export default Home
