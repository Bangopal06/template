import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// API endpoint untuk menerima data dari n8n
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    console.log('📥 n8n webhook received:', JSON.stringify(body, null, 2))

    // Validasi API key (opsional, untuk keamanan)
    const apiKey = req.headers.get('x-api-key')
    if (apiKey !== process.env.N8N_API_KEY) {
      console.log('❌ Invalid API key')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract data dari payload n8n
    // Format: array of objects dengan structure WhatsApp webhook
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid payload format. Expected array.' }, { status: 400 })
    }

    const results = []

    for (const item of body) {
      const { metadata, contacts, messages } = item

      if (!messages || !Array.isArray(messages)) {
        console.log('⚠️ No messages in payload item')
        continue
      }

      for (const message of messages) {
        const waId = message.from
        const phoneNumber = waId

        // Cari atau buat contact
        let contact = await prisma.contact.findUnique({
          where: { waId },
        })

        if (!contact) {
          // Dapatkan default label (qualified lead)
          let defaultLabel = await prisma.label.findFirst({
            where: { name: 'qualified lead' },
          })

          // Jika label belum ada, buat dulu
          if (!defaultLabel) {
            defaultLabel = await prisma.label.create({
              data: {
                name: 'qualified lead',
                order: 1,
                color: '#3B82F6',
              },
            })
          }

          // Get contact name from contacts array
          const contactName = contacts?.[0]?.profile?.name || phoneNumber

          contact = await prisma.contact.create({
            data: {
              waId,
              phoneNumber,
              name: contactName,
              labelId: defaultLabel.id,
            },
          })

          console.log('✅ Contact created:', contact.name)
        }

        // Simpan message
        let messageData: any = {
          waMessageId: message.id,
          contactId: contact.id,
          isFromContact: true,
          timestamp: new Date(parseInt(message.timestamp) * 1000),
          status: 'DELIVERED',
        }

        // Handle different message types
        if (message.type === 'text') {
          messageData.type = 'TEXT'
          messageData.content = message.text.body
        } else if (message.type === 'image') {
          messageData.type = 'IMAGE'
          messageData.mediaUrl = message.image.id
          messageData.caption = message.image.caption
        } else if (message.type === 'video') {
          messageData.type = 'VIDEO'
          messageData.mediaUrl = message.video.id
          messageData.caption = message.video.caption
        } else if (message.type === 'document') {
          messageData.type = 'DOCUMENT'
          messageData.mediaUrl = message.document.id
          messageData.caption = message.document.filename
        } else if (message.type === 'audio') {
          messageData.type = 'AUDIO'
          messageData.mediaUrl = message.audio.id
        }

        // Cek apakah message sudah ada (untuk avoid duplicate)
        const existingMessage = await prisma.message.findUnique({
          where: { waMessageId: message.id },
        })

        if (!existingMessage) {
          const savedMessage = await prisma.message.create({ data: messageData })
          console.log('✅ Message saved:', message.id)
          results.push({
            success: true,
            messageId: message.id,
            contactName: contact.name,
            content: messageData.content || 'Media message'
          })
        } else {
          console.log('⚠️ Message already exists:', message.id)
          results.push({
            success: false,
            messageId: message.id,
            reason: 'Duplicate message'
          })
        }
      }
    }

    return NextResponse.json({ 
      status: 'ok',
      processed: results.length,
      results
    })
  } catch (error: any) {
    console.error('❌ n8n webhook error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ 
      status: 'error',
      message: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}

// GET method untuk test endpoint
export async function GET(req: Request) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'n8n webhook endpoint is ready',
    usage: 'POST to this endpoint with WhatsApp message data from n8n'
  })
}
