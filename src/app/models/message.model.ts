export interface IMessage {
  id?: string;
  text: string;
  sender: string;
  groupId: string;
  timestamp: number;
}
