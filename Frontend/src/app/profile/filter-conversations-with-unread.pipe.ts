import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterConversationsWithUnread',
  standalone: true
})
export class FilterConversationsWithUnreadPipe implements PipeTransform {
  transform(conversations: { unreadCount?: number }[]): { unreadCount?: number }[] {
    if (!conversations) return [];
    return conversations.filter(convo => convo.unreadCount && convo.unreadCount > 0);
  }
}