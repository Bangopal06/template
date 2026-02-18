# Setup n8n untuk Kirim Data ke CRM WhatsApp

## Overview

Anda akan menggunakan n8n untuk:
1. Menerima pesan WhatsApp dari nomor manapun
2. Mengirim data pesan ke CRM via HTTP node
3. Data akan tersimpan di database dan muncul di dashboard

## Setup di CRM (Vercel)

### 1. Tambahkan API Key di Environment Variables

1. Buka Vercel Dashboard
2. Project `crm-wa` > Settings > Environment Variables
3. Tambahkan variable baru:
   ```
   Name: N8N_API_KEY
   Value: <generate_random_string_panjang>
   ```
   
   Contoh value: `n8n_secret_key_12345_abcdefghijklmnop`

4. Apply to: Production, Preview, Development
5. Save
6. Redeploy app

### 2. Deploy Perubahan

```bash
git add .
git commit -m "feat: add n8n webhook endpoint"
git push
```

Tunggu deployment selesai.

### 3. Test Endpoint

```bash
curl https://crm-wa.vercel.app/api/n8n/webhook
```

Harus return:
```json
{
  "status": "ok",
  "message": "n8n webhook endpoint is ready",
  "usage": "POST to this endpoint with WhatsApp message data from n8n"
}
```

## Setup di n8n

### Workflow Structure

```
WhatsApp Trigger Node → HTTP Request Node → (Optional) Error Handler
```

### 1. WhatsApp Trigger Node

Setup WhatsApp trigger node Anda seperti biasa untuk menerima pesan.

Output dari node ini akan berisi data seperti:
```json
{
  "messaging_product": "whatsapp",
  "metadata": {
    "display_phone_number": "15551410892",
    "phone_number_id": "988128274384219"
  },
  "contacts": [{
    "profile": {
      "name": "Aji Maulana"
    },
    "wa_id": "6285175434869"
  }],
  "messages": [{
    "from": "6285175434869",
    "id": "wamid.xxx",
    "timestamp": "1771454200",
    "text": {
      "body": "jkh"
    },
    "type": "text"
  }],
  "field": "messages"
}
```

### 2. HTTP Request Node

Tambahkan HTTP Request node setelah WhatsApp trigger:

**Settings:**

- **Method**: POST
- **URL**: `https://crm-wa.vercel.app/api/n8n/webhook`
- **Authentication**: None (kita pakai API key di header)
- **Send Headers**: Yes
  - Header 1:
    - Name: `x-api-key`
    - Value: `n8n_secret_key_12345_abcdefghijklmnop` (sama dengan yang di Vercel)
  - Header 2:
    - Name: `Content-Type`
    - Value: `application/json`

**Body:**

- **Body Content Type**: JSON
- **Specify Body**: Using JSON

**JSON Body** (gunakan expression):

```json
[
  {
    "messaging_product": "{{ $json.messaging_product }}",
    "metadata": {{ $json.metadata }},
    "contacts": {{ $json.contacts }},
    "messages": {{ $json.messages }},
    "field": "{{ $json.field }}"
  }
]
```

Atau jika data sudah dalam format array, langsung pass:

```json
{{ $json }}
```

**Options:**

- **Response Format**: JSON
- **Timeout**: 30000 (30 detik)

### 3. (Optional) Error Handler

Tambahkan node untuk handle error jika HTTP request gagal.

## Testing

### Test dari n8n

1. Aktifkan workflow di n8n
2. Kirim pesan WhatsApp ke nomor yang di-monitor n8n
3. Lihat execution di n8n:
   - WhatsApp trigger harus menerima pesan
   - HTTP node harus return status 200 dengan response:
     ```json
     {
       "status": "ok",
       "processed": 1,
       "results": [
         {
           "success": true,
           "messageId": "wamid.xxx",
           "contactName": "Aji Maulana",
           "content": "jkh"
         }
       ]
     }
     ```

4. Buka CRM dashboard: https://crm-wa.vercel.app/dashboard/messages
5. Pesan harus muncul di sana

### Test Manual dengan curl

```bash
curl -X POST https://crm-wa.vercel.app/api/n8n/webhook \
  -H "Content-Type: application/json" \
  -H "x-api-key: n8n_secret_key_12345_abcdefghijklmnop" \
  -d '[
    {
      "messaging_product": "whatsapp",
      "metadata": {
        "display_phone_number": "15551410892",
        "phone_number_id": "988128274384219"
      },
      "contacts": [
        {
          "profile": {
            "name": "Test User"
          },
          "wa_id": "6281234567890"
        }
      ],
      "messages": [
        {
          "from": "6281234567890",
          "id": "wamid.test_'$(date +%s)'",
          "timestamp": "'$(date +%s)'",
          "text": {
            "body": "Test message from curl"
          },
          "type": "text"
        }
      ],
      "field": "messages"
    }
  ]'
```

## Troubleshooting

### Error: 401 Unauthorized

**Penyebab**: API key salah atau tidak ada

**Solusi**:
1. Cek API key di Vercel environment variables
2. Pastikan API key di n8n HTTP node sama persis
3. Redeploy app setelah update environment variable

### Error: 400 Bad Request

**Penyebab**: Format payload salah

**Solusi**:
1. Pastikan body adalah array `[{...}]`
2. Cek struktur data dari WhatsApp trigger node
3. Pastikan field `messages` ada dan berisi array

### Error: 500 Internal Server Error

**Penyebab**: Database error atau code issue

**Solusi**:
1. Cek Vercel logs untuk detail error
2. Pastikan database connection masih aktif
3. Cek apakah label "qualified lead" sudah ada di database

### Pesan Tidak Muncul di Dashboard

**Penyebab**: Message ID duplicate atau data tidak tersimpan

**Solusi**:
1. Cek Vercel logs untuk melihat apakah message tersimpan
2. Cek response dari HTTP node di n8n
3. Refresh dashboard atau clear cache browser

## Data Format

### Input (dari n8n)

```json
[
  {
    "messaging_product": "whatsapp",
    "metadata": {
      "display_phone_number": "15551410892",
      "phone_number_id": "988128274384219"
    },
    "contacts": [
      {
        "profile": {
          "name": "Contact Name"
        },
        "wa_id": "628xxxxxxxxxx"
      }
    ],
    "messages": [
      {
        "from": "628xxxxxxxxxx",
        "id": "wamid.unique_id",
        "timestamp": "1771454200",
        "text": {
          "body": "Message content"
        },
        "type": "text"
      }
    ],
    "field": "messages"
  }
]
```

### Output (response)

```json
{
  "status": "ok",
  "processed": 1,
  "results": [
    {
      "success": true,
      "messageId": "wamid.unique_id",
      "contactName": "Contact Name",
      "content": "Message content"
    }
  ]
}
```

## Security

1. **API Key**: Gunakan API key yang panjang dan random
2. **HTTPS**: Endpoint sudah menggunakan HTTPS (Vercel)
3. **Validation**: Endpoint memvalidasi format payload
4. **Duplicate Check**: Message ID di-check untuk avoid duplicate

## Monitoring

1. **Vercel Logs**: Monitor incoming requests dan errors
2. **n8n Execution History**: Lihat success/failure rate
3. **Database**: Cek jumlah messages dan contacts yang tersimpan

## Next Steps

Setelah setup berhasil:

1. Monitor workflow di n8n untuk memastikan tidak ada error
2. Cek dashboard CRM secara berkala
3. Setup notification jika ada error (optional)
4. Backup database secara berkala

## Support

Jika ada masalah:
1. Cek Vercel logs
2. Cek n8n execution logs
3. Test dengan curl untuk isolate masalah
4. Pastikan API key match antara n8n dan Vercel
