import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 3001)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, 'dist')

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Server is running.' })
})

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' })
  }

  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER
  const emailPass = (process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, '')
  const resendApiKey = process.env.RESEND_API_KEY
  const emailTo = process.env.EMAIL_TO || process.env.GMAIL_TO || emailUser

  if (!emailTo || (!resendApiKey && (!emailUser || !emailPass))) {
    return res.status(500).json({
      message: 'Email is not configured. Set RESEND_API_KEY and EMAIL_TO, or set EMAIL_USER and EMAIL_PASS.',
    })
  }

  try {
    const emailContent = {
      to: emailTo,
      replyTo: email,
      subject: `Portfolio inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    }

    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>',
          to: emailContent.to,
          reply_to: emailContent.replyTo,
          subject: emailContent.subject,
          text: emailContent.text,
        }),
      })

      if (!response.ok) {
        console.error('Resend email failed. status:', response.status)
        console.error('Resend error response:', await response.text())
        return res.status(502).json({ message: 'Unable to send the email right now. Please try again later.' })
      }
    } else {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      })

      await transporter.sendMail({
        from: emailUser,
        ...emailContent,
      })
    }

    return res.status(200).json({ message: 'Message sent successfully.' })
  } catch (error) {
    console.error('Email send failed. code:', error?.code)
    console.error('SMTP error response:', error?.response || error?.message)
    return res.status(500).json({ message: 'Unable to send the email right now. Please try again later.' })
  }
})

app.use(express.static(distPath))
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`)
})
