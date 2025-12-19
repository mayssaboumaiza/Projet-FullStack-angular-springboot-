import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { TimeAgoPipe } from '../shared/pipes/time-ago.pipe';
import { FilterConversationsWithUnreadPipe } from '../profile/filter-conversations-with-unread.pipe';
interface AlumniDTO {
  firstName: string;
  lastName: string;
  department: string;
  graduationYear: number;
}
export interface ConversationPreview {
  id: number;
  otherUser: {
    id: number;
    name: string;
  };
  lastMessageContent: string;
  lastMessageDate: string;
  unreadCount: number;
  role: string; 
}
interface Post {
  id: number;
  description: string;
  createdAt: string;
  type: 'Post' | 'Offer';
  creator: {
    firstName: string;
    lastName: string;
    company: string;
  };
}
@Component({
  selector: 'app-profile-alumni',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,TimeAgoPipe,FilterConversationsWithUnreadPipe],
  templateUrl:'./profile-alumni.component.html',
  styleUrls: ['./profile-alumni.component.css']
})
export class ProfileAlumniComponent implements OnInit{
  user: any = {};
  userType: string = '';
  showHome: boolean = true;
  showPosts: boolean = false;
  showNewPost: boolean = false;
  showEditProfile: boolean = false;
  showFlaggedPopup: boolean = false;
  showMenu: boolean = false;
  isJobOffer: boolean = false;
  jobType: string = 'internship';
  duration: string = 'Semester';
  company: string = '';
  position: string = '';
  salary: string = '';
  description: string = '';
  content: string = '';
  jobTitle: string = 'Developer';
  companyName: string = 'XY';
  showMessages: boolean = false;
  preferences: { mentor: boolean, referrals: boolean, advice: boolean } = { mentor: false, referrals: false, advice: false };
  userPosts: any[] = [];
  feedPosts: any[] = [];
  offers: any[] = [];
  showPostMenu: boolean = false;
  selectedPostIndex: number | null = null;
  editingPostIndex: number | null = null;
  showOfferMenu: boolean = false;
  selectedOfferIndex: number | null = null;
  department: string = '';
  graduationYear: string = '';
  fullName: string = '';
  
  constructor(private router: Router,private http : HttpClient,private authService : AuthService) {
    this.router.navigate(['/profile-alumni']);
  }
  ngOnInit(): void {
    const user = this.authService.getUser();
    const userType = this.authService.getUserType();
  
    if (!user) {
      console.error("User not found. Make sure the user is logged in.");
      return;
    }
  
    this.user = user;
    this.currentUserId = this.user.id;
    this.userType = userType;
  
    if (!user || userType !== 'alumni') {
      this.router.navigate(['/login']); // Redirect if not logged in or not an alumni
      return;
    }
  
    this.loadAlumniInfo(user.id); // Load alumni-specific data (e.g., graduationYear, department)
    this.loadPosts(); // Load posts or offers if needed
    this.loadFeed();
    this.loadConversations();
  }
  loadAlumniInfo(id: number): void {
    this.http.get<AlumniDTO>(`/api/alumni/${id}/info`).subscribe({
      next: (info) => {
        this.department = info.department || 'Not specified';
        this.graduationYear = info.graduationYear?.toString() || 'NA';
        this.fullName = `${info.firstName} ${info.lastName}`;
      },
      error: (err) => {
        console.error('Failed to load alumni info:', err);
      }
    });
  }
  
  classOf2021 = [
    { name: 'Nadia Lauren' },
    { name: 'Foulena' }
  ];

  studentsInField = [
    { name: 'Hedi Jlassi' }
  ];



  toggleHome(): void {
    this.showHome = !this.showHome;
    if (this.showHome) {
      this.showPosts = false;
      this.showNewPost = false;
      this.showEditProfile = false;
      this.editingPostIndex = null;
      this.showPostMenu = false;
      this.selectedPostIndex = null;
    }
  }
  togglePosts(): void {
    this.showPosts = !this.showPosts;
    if (this.showPosts) {
      this.showHome = false;
      this.showNewPost = false;
      this.showEditProfile = false;
      this.editingPostIndex = null;
      this.showPostMenu = false;
      this.selectedPostIndex = null;
      this.showOfferMenu = false;
      this.selectedOfferIndex = null;
      this.showFlaggedPopup = false;
    }
  }
  toggleEditProfile(): void {
    this.showEditProfile = !this.showEditProfile;
    if (this.showEditProfile) {
      this.showNewPost = false;
      this.editingPostIndex = null;
    }
  }
  toggleNewPost(): void {
    this.showNewPost = !this.showNewPost;
  }
  toggleJobOffer(): void {
    if (!this.isJobOffer) {
      this.jobType = 'internship';
      this.duration = 'Semester';
      this.company = '';
      this.position = '';
      this.salary = '';
      this.description = '';
      this.content = '';
    }
  }
  toggleOfferMenu(index: number): void {
    if (this.selectedOfferIndex === index && this.showOfferMenu) {
      this.showOfferMenu = false;
      this.selectedOfferIndex = null;
    } else {
      this.showOfferMenu = true;
      this.selectedOfferIndex = index;
    }
  }


  flagForReview(index: number): void {
    console.log(`Offer at index ${index} flagged for review`);
    this.showOfferMenu = false;
    this.selectedOfferIndex = null;
  }
  closeFlaggedPopup(): void {
    this.showFlaggedPopup = false;
  }

  changeJobTitle(): void {
    if (this.jobTitle.trim()) {
      console.log('Job title changed to:', this.jobTitle);
    }
  }

  changeCompany(): void {
    if (this.companyName.trim()) {
      console.log('Company changed to:', this.companyName);
    }
  }

  savePreferences(): void {
    console.log('Preferences saved:', this.preferences);
  }
  submitPost(): void {
    const currentDate = new Date().toISOString();
    const creatorId = this.user?.id;
  
    if (!creatorId) {
      alert('User not authenticated');
      return;
    }
  
    if (this.isJobOffer && this.description.trim()) {
      const offerPayload = {
        offerType: this.jobType === 'job' ? 'Job' : 'Internship',
        position: this.position,
        company: this.company,
        duration: this.duration,
        proposedSalary: this.salary || 0,
        status: true,
        description: this.description,
        createdAt: currentDate,
        creatorId: creatorId
      };
  
      this.http.post('/api/offers', offerPayload).subscribe({
        next: () => {
          this.resetForm();
          this.loadPosts();
        },
        error: (err) => {
          console.error('Failed to post offer:', err);
          alert('Failed to post offer');
        }
      });
    } else if (this.content.trim()) {
      const postPayload = {
        description: this.content,
        createdAt: currentDate,
        creatorId: creatorId
      };
  
      this.http.post('/api/posts', postPayload).subscribe({
        next: () => {
          this.resetForm();
          this.loadPosts();
        },
        error: (err) => {
          console.error('Failed to create post:', err);
          alert('Failed to create post');
        }
      });
    }
  }
  resetForm(): void {
    this.description = '';
    this.content = '';
    this.position = '';
    this.company = '';
    this.salary = '';
    this.duration = '';
    this.showNewPost = false;
    this.isJobOffer = false;
  }
  loadPosts(): void {
    const userId = this.user?.id;
    if (!userId) return;
  
    this.http.get<any[]>(`http://localhost:8080/api/posts/user/${userId}`)
      .subscribe({
        next: (data) => {
          this.userPosts = data;
        },
        error: (err) => {
          console.error('Failed to load user posts', err);
        }
      });
  }
  

  togglePostMenu(index: number): void {
    if (this.selectedPostIndex === index && this.showPostMenu) {
      this.showPostMenu = false;
      this.selectedPostIndex = null;
    } else {
      this.showPostMenu = true;
      this.selectedPostIndex = index;
    }
  }
  editedDescription: string | null = null;
  editingPostType: 'Post' | 'Offer' | null = null;
  editingPostId: number | null = null;
  editPost(index: number): void {
    const post = this.userPosts[index];
    this.editingPostIndex = index;
    this.editedDescription = post.description;
    this.editingPostId = post.id;
    this.editingPostType = post.type || 'Post';
    this.showPostMenu = false;
    this.selectedPostIndex = null;
  }

  deletePost(index: number): void {
    const postId = this.userPosts[index]?.id;

    if (!postId) {
      console.error('Post ID not found');
      return;
    }
  
    this.http.delete(`http://localhost:8080/api/posts/${postId}`).subscribe({
      next: () => {
        this.userPosts.splice(index, 1); // Remove from the array
        this.showPostMenu = false;
        this.selectedPostIndex = null;
      },
      error: (err) => {
        console.error('Failed to delete post', err);
        alert('Error deleting post');
      }
    });
  }

  saveEdit(): void {
    if (!this.editedDescription || this.editingPostId === null || !this.editingPostType) {
      console.log('Edit data is incomplete:', { 
        editedDescription: this.editedDescription,
        editingPostId: this.editingPostId,
        editingPostType: this.editingPostType 
      });
      return;  // Avoid sending an empty or incorrect request
    }

    console.log('editing post id %d',this.editingPostId);
    const url = this.editingPostType === 'Offer'
      ? `http://localhost:8080/api/offers/${this.editingPostId}/description`
      : `http://localhost:8080/api/posts/${this.editingPostId}/description`;
  
    console.log('Sending update to URL:', url);
    console.log('Description:', this.editedDescription);
  
    this.http.put(url, this.editedDescription, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => {
        console.log('Post updated successfully');
        if (this.editingPostIndex !== null) {
          this.userPosts[this.editingPostIndex].description = this.editedDescription!;
        }
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Failed to update description:', err);
        alert('Failed to update description');
      }
    });
  }

  cancelEdit(): void {
    this.editingPostIndex = null;
    this.editedDescription = null;
    this.editingPostType = null;
    this.editingPostId = null;
  }
  loadFeed(): void {
    const userId = this.user?.id;
    if (!userId) {
      alert("User not authenticated");
      return;
    }
  
    this.http.get<any[]>(`http://localhost:8080/api/feed/${userId}`)
      .subscribe({
        next: (data) => {
          this.offers = data.filter(item => item.type === 'Offer');
          this.feedPosts = data.filter(item => item.type === 'Post');
        },
        error: (err) => {
          console.error('Failed to load feed:', err);
          alert("Error loading feed");
        }
      });
  }
   currentUserId!: number;
    conversations: ConversationPreview[] = [];
    selectedConversation: any = null;
    newMessage: string = '';
  loadConversations() {
    console.log('Loading conversations for user:', this.currentUserId);
  
    this.http.get<any>(`http://localhost:8080/api/conversations/user/${this.currentUserId}`, {
      params: {
        currentUserId: this.currentUserId.toString(),
        page: '0',
        size: '20'
      }
    }).subscribe({
      next: (response) => {
        console.log('API Response:', response);
  
        this.conversations = response.content.map((convo: any) => ({
          id: convo.id,
          otherUser: convo.otherUser, 
          lastMessageContent: convo.lastMessageContent,
          lastMessageDate: convo.lastMessageDate,
          unreadCount: convo.unreadCount,
          role: convo.role
        }));
      },
      error: (err) => {
        console.error('API Error:', err);
        alert('Failed to load conversations.');
      }
    });
  }

  selectConversation(conversation: ConversationPreview) {
    this.showMessages = true;
  
    this.http.get<any>(`/api/conversations/${conversation.id}/messages`, {
      params: new HttpParams()
        .set('currentUserId', this.user.id)
        .set('page', '0')
        .set('size', '50')
    }).subscribe({
      next: (response) => {
        this.selectedConversation = {
          ...conversation,
          messages: response.content
            .map((msg: any) => ({
              ...msg,
              isCurrentUser: msg.sender.id === this.user.id
            }))
            .reverse()
        };
      },
      error: (err) => {
        console.error('Error loading messages:', err);
      }
    });
  }
  getTotalUnreadCount(): number {
    return this.conversations.reduce((sum, convo) => sum + convo.unreadCount, 0);
  }
  getSimpleRole(role: string): string {
    if (!role) return '';
    const parts = role.split('.');
    return parts[parts.length - 1];
  }
  newMessageContent: string = '';

  sendMessage() {
    if (!this.newMessageContent.trim() || !this.selectedConversation) return;
  
    const messagePayload = {
      conversationId: this.selectedConversation.id,
      senderId: this.currentUserId,
      receiverId: this.selectedConversation.otherUser.id,
      content: this.newMessageContent
    };
  
    this.http.post<any>('http://localhost:8080/api/conversations/messages', messagePayload, {
      params: { senderId: this.currentUserId }
    }).subscribe({
      next: (newMsg) => {
        this.selectedConversation.messages.push({
          ...newMsg,
          isCurrentUser: true
        });
        this.newMessageContent = '';
      },
      error: (err) => {
        console.error('Failed to send message:', err);
        alert('Could not send the message.');
      }
    });
  }
  toggleMessages() {
    this.showMessages=!this.showMessages;
    if (this.showMessages){
      this.showHome = false;
      this.showPosts = false;
      this.showNewPost = false;
      this.showEditProfile = false;
      this.editingPostIndex = null;
      this.showPostMenu = false;
      this.selectedPostIndex = null;
    }
    console.log('Messages toggled: ', this.showMessages);
  }
  logOut() {
    console.log('Logging out...');
    this.showMenu = false;
    this.router.navigate(['/']);
  }

  setAccountToPrivate() {
    console.log('Setting account to private...');
    this.showMenu = false;
  }

  deleteAccount() {
    console.log('Deleting account...');
    this.showMenu = false;
  }
}



