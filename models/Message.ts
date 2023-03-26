export interface Message {
  id?: string,
  content: string,
  role: 'user' | 'assistant'
  createdAt: any
  state?: 'sent' | 'failed' | 'loading'

  conversationID?: string

}