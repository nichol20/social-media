import axios from "axios"
import { GetServerSideProps } from "next"
import { http } from "./http"

type WithAuth = (gssp: GetServerSideProps) => GetServerSideProps

export const withAuth: WithAuth = gssp => {
  return async context => {
    const cookies = context.req.cookies
  
    if(!cookies.token) {
      return {
        redirect: {
          statusCode: 302,
          destination: '/login',
        }
      }
    }

    try {
      const result = await gssp(context)
      const { token } = context.req.cookies

      const { sub: userId } = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"))
      
      const { data } = await axios.get(`http://server:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return {
        ...result,
        props: {
          userData: {
            ...data,
            token
          },
          //@ts-ignore
          ...result.props
        }
      }

    } catch (error: any) {
      console.log(error)
      return {
        redirect: {
          statusCode: 302,
          destination: '/login'
        }
      }
    }

  }
}