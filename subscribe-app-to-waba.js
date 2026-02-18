// Subscribe App to WhatsApp Business Account
// Ini diperlukan agar app bisa menerima webhook dari WABA

const ACCESS_TOKEN = process.env.WABA_ACCESS_TOKEN || 'EAAT8jTrSjuEBQjlr4WpKrZB0q64bBT6Ls3DSIHFmwMQFT55zezdb265Nhx8ZA5BTi2DFeoAnrDMZCSZAdTzyfqXdbriZBQbI604YGtEHRlMJwZACZAffJ8YKBbbRxk4dJLs1DELUIpsbfC6Ov88SW32VUXLb37hZC4Y6nLahv9ZAdZANYH625vfotafZCyR9seSIAZDZD'

console.log('🔗 Subscribe App to WABA\n')
console.log('─'.repeat(60))

// Step 1: Get WABA ID
async function getWABAId() {
  console.log('\n1️⃣ Getting WABA ID...\n')
  
  try {
    // Method 1: Get from debug token
    const debugResponse = await fetch(`https://graph.facebook.com/v21.0/debug_token?input_token=${ACCESS_TOKEN}&access_token=${ACCESS_TOKEN}`)
    const debugData = await debugResponse.json()
    
    if (debugData.data && debugData.data.granular_scopes) {
      console.log('Token scopes:', debugData.data.granular_scopes)
    }
    
    // Method 2: Try to get WABA from business
    const businessResponse = await fetch(`https://graph.facebook.com/v21.0/me/businesses?access_token=${ACCESS_TOKEN}`)
    const businessData = await businessResponse.json()
    
    if (businessData.data && businessData.data.length > 0) {
      console.log('Businesses:', businessData.data)
      
      // Get WABA from first business
      const businessId = businessData.data[0].id
      const wabaResponse = await fetch(`https://graph.facebook.com/v21.0/${businessId}/owned_whatsapp_business_accounts?access_token=${ACCESS_TOKEN}`)
      const wabaData = await wabaResponse.json()
      
      if (wabaData.data && wabaData.data.length > 0) {
        const wabaId = wabaData.data[0].id
        console.log('✅ WABA ID:', wabaId)
        console.log('WABA Name:', wabaData.data[0].name)
        return wabaId
      }
    }
    
    // Method 3: Manual input
    console.log('\n⚠️  Could not automatically get WABA ID')
    console.log('\nCara manual:')
    console.log('1. Buka: https://business.facebook.com/wa/manage/home/')
    console.log('2. Pilih WhatsApp Business Account Anda')
    console.log('3. Lihat URL, akan ada angka seperti: /wa/manage/home/?waba_id=XXXXXXXXXX')
    console.log('4. Copy angka tersebut (WABA ID)')
    console.log('\nAtau coba jalankan:')
    console.log(`curl "https://graph.facebook.com/v21.0/me/businesses?access_token=${ACCESS_TOKEN}"`)
    
    return null
  } catch (error) {
    console.log('❌ Error:', error.message)
    return null
  }
}

// Step 2: Subscribe App to WABA
async function subscribeApp(wabaId) {
  console.log('\n2️⃣ Subscribing App to WABA...\n')
  console.log('WABA ID:', wabaId)
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      }
    )
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ App successfully subscribed to WABA!')
      console.log('\nSekarang webhook akan menerima pesan dari nomor WhatsApp Business Anda.')
      console.log('\nTest dengan:')
      console.log('1. Kirim pesan dari nomor 628xxx ke +6551410892')
      console.log('2. Cek Vercel logs')
      console.log('3. Cek dashboard: https://crm-wa.vercel.app/dashboard/messages')
      return true
    } else {
      console.log('❌ Failed to subscribe app')
      console.log('Response:', data)
      
      if (data.error) {
        console.log('\nError:', data.error.message)
        console.log('Type:', data.error.type)
        console.log('Code:', data.error.code)
        
        if (data.error.code === 190) {
          console.log('\n⚠️  Token issue. Kemungkinan:')
          console.log('1. Token expired')
          console.log('2. Token tidak punya permission yang cukup')
          console.log('3. Token tidak terhubung ke WABA yang benar')
        }
      }
      return false
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
    return false
  }
}

// Step 3: Verify subscription
async function verifySubscription(wabaId) {
  console.log('\n3️⃣ Verifying subscription...\n')
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps?access_token=${ACCESS_TOKEN}`
    )
    
    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      console.log('✅ Subscribed apps:')
      data.data.forEach(app => {
        console.log(`   - ${app.whatsapp_business_api_data?.id || app.id}`)
      })
      return true
    } else {
      console.log('⚠️  No apps subscribed to this WABA')
      return false
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
    return false
  }
}

// Run all steps
async function run() {
  const wabaId = await getWABAId()
  
  if (!wabaId) {
    console.log('\n❌ Could not get WABA ID. Please provide it manually.')
    console.log('\nCara mendapatkan WABA ID:')
    console.log('1. Buka business.facebook.com')
    console.log('2. WhatsApp Business Account settings')
    console.log('3. Copy WABA ID dari URL atau settings')
    console.log('\nAtau jalankan:')
    console.log('curl "https://graph.facebook.com/v21.0/988128274384219?fields=whatsapp_business_account&access_token=YOUR_TOKEN"')
    return
  }

  console.log('\n' + '─'.repeat(60))
  
  const subscribed = await subscribeApp(wabaId)
  
  if (subscribed) {
    console.log('\n' + '─'.repeat(60))
    await verifySubscription(wabaId)
  }
  
  console.log('\n' + '─'.repeat(60))
  console.log('\n✅ Done!')
}

run()
