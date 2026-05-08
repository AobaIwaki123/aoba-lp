export async function notifySlack(message: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('Slack Webhook URL is not configured. Message:', message)
    return
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
      }),
    })

    if (!response.ok) {
      console.error('Failed to send Slack notification', await response.text())
    }
  } catch (error) {
    console.error('Error sending Slack notification', error)
  }
}
