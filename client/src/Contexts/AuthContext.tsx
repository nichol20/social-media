import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { createContext, Dispatch, SetStateAction, useState } from "react"
import { http } from "../utils/http"

export interface User {
  created_at: number
  email: string
  avatar: string
  avatar_path: string
  cover_photo: string
  cover_photo_path: string
  name: string
  posts: string[]
  liked_posts: string[]
  token: string
  _id: string
}

interface SignInParameters {
  email: string
  password: string
}

type SignIn = (data: SignInParameters) => Promise<void>
type SignUp = (data: FormData) => Promise<void>
type SignOut = () => void

interface AuthContext {
  signIn: SignIn
  signUp: SignUp
  signOut: SignOut
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter()
  const [ user, setUser ] = useState<User | null>(null)

  const signIn: SignIn = async ({ email, password }) => {
    const { data } = await http.post('/login', {
      email,
      password
    })
  
    router.push('/')
    Cookies.set('token', data.token)
  }
  
  const signUp: SignUp = async formData => {
    try {
      const { data } = await http.post('/users', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    
      router.push('/')
      Cookies.set('token', data.token)
    } catch (error) {
      console.log(error)
    }
  }
  
  const signOut: SignOut = () => {
    router.push('/login')
    Cookies.remove('token')
  }

  return (
    <AuthContext.Provider value={{ signIn, signUp, signOut, user, setUser }}>
      { children }
    </AuthContext.Provider>
  )
}