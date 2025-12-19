import { UserDto } from "./user.dto";

export interface MessageDto {
    id: number;
    content: string;
    sentDate: string;
    sender: UserDto;
    isCurrentUser?: boolean;  // This will be added on the frontend
  }