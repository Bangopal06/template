import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { functions, executeFunction } from './functions'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: 'Anda adalah asisten AI yang membantu mengelola dashboard aplikasi. Anda memiliki akses ke database untuk mendapatkan informasi tentang pengguna. Jawab pertanyaan dengan jelas dan informatif dalam bahasa Indonesia. Jika ditanya tentang statistik atau data pengguna, gunakan function yang tersedia.',
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message,
      },
    ]

    // First API call with function definitions
    let chatCompletion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      tools: functions.map(f => ({
        type: 'function',
        function: f,
      })) as any,
      tool_choice: 'auto',
    })

    let responseMessage = chatCompletion.choices[0]?.message

    // Check if AI wants to call a function
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      // Execute the function
      const toolCall = responseMessage.tool_calls[0]
      const functionName = toolCall.function.name
      const functionArgs = JSON.parse(toolCall.function.arguments || '{}')

      const functionResult = await executeFunction(functionName, functionArgs)

      // Add function result to conversation
      messages.push(responseMessage as any)
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(functionResult),
      } as any)

      // Second API call with function result
      chatCompletion = await groq.chat.completions.create({
        messages: messages as any,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      })

      responseMessage = chatCompletion.choices[0]?.message
    }

    const reply = responseMessage?.content || 'Maaf, tidak ada respons.'

    return NextResponse.json({
      success: true,
      reply,
      usage: chatCompletion.usage,
    })
  } catch (error: any) {
    console.error('Groq API error:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    )
  }
}
