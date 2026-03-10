'use server'
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export type Session = {
  userId: string
  email: string
  role: string
  name?: string
}

const secretKey = process.env.SESSION_SECRET
const encodedKey = secretKey ? new TextEncoder().encode(secretKey) : null
const cookieName = 'session'

export async function createSession(sessionData: Session) {
  if (!secretKey || !encodedKey) {
    throw new Error('SESSION_SECRET environment variable is not set.')
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const token = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days
    .sign(encodedKey)

  const cookieStore = await cookies()
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifySession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(cookieName)?.value
  
  if (!cookie || !secretKey || !encodedKey) {
    return null
  }
  
  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as Session
  } catch (error) {
    console.error('Failed to verify session:', error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
}
