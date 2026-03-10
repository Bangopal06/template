import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    const validToken = process.env.REGISTRATION_TOKEN

    if (!validToken || !token) {
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({ valid: token === validToken })
  } catch (error) {
    return NextResponse.json({ valid: false })
  }
}
