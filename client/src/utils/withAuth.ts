import { GetServerSideProps, GetServerSidePropsContext } from "next"

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
      
      return result
    } catch (error: any) {
      console.log(error.message)
      return {
        redirect: {
          statusCode: 302,
          destination: '/login'
        }
      }
    }

  }
}