export interface Message {
  id?: string,
  content: string,
  role: 'user' | 'assistant' | 'system' | 'error',
  createdAt: any
  state?: 'sent' | 'failed' | 'loading'

  conversationID?: string

  token?: string[]

}