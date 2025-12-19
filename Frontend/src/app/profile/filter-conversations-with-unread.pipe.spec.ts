import { FilterConversationsWithUnreadPipe } from './filter-conversations-with-unread.pipe';
describe('FilterConversationsWithUnreadPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterConversationsWithUnreadPipe();
    expect(pipe).toBeTruthy();
  });
});
