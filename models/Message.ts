export interface Message {
  content: string,
  senderId: string,
  createdAt: any
  state?: 'sent' | 'failed' | 'loading'

}