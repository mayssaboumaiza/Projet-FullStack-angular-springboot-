import { MessageDto } from "./message.dto";
import { UserDto } from "./user.dto";


export interface ConversationDto {
    id: number;
    otherUser: UserDto;
    lastMessage?: MessageDto;
    unreadCount: number;
    messages?: MessageDto[];
  }