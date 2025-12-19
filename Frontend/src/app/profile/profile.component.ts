import { Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterConversationsWithUnreadPipe } from './filter-conversations-with-unread.pipe';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { InfoDTO } from './InfoDTO';
import { AuthService } from '../auth.service';
import { ConversationDto } from '../models/conversation.dto';
import { MessageDto } from '../models/message.dto';
import { TimeAgoPipe } from '../shared/pipes/time-ago.pipe';

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
interface Message {
  id: number;
  content: string;
  sentDate: string;
  sender: {
    id: number;
    name: string;
  };
  isCurrentUser?: boolean;
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
export interface Document {
  description: string;
  fileName: string;
  fileType: string;
  date: string;
  fileUrl: string;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TimeAgoPipe, FilterConversationsWithUnreadPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit{ 
  user: any = {};
  userType: string = '';
  showAddForm: boolean = false;
  showEditForm: boolean = false;
  showMenu: boolean = false;
  showLatestOffers: boolean = false;
  showMessages: boolean = false;
  showDocuments: boolean = true; // Flag to toggle Documents visibility (default to true)
  description: string = '';
  selectedFile: File | null = null;
  showDashboard = false;
  skills: string = 'Not specified';
  speciality: string='NA';
  searchingFor: string = 'NA';
  graduationYear: string = '2027';
  currentUserId!: number;
  conversations: ConversationPreview[] = [];
  selectedConversation: any = null;
  newMessage: string = '';
  documents: Document[] = [];
  latestOffers: any[] = [];
  constructor(private router: Router, private http: HttpClient,private authService : AuthService) {
    console.log('Constructor called');
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user?.id) {
        this.currentUserId = user.id;
        this.loadConversations();
        this.loadStudentInfo(user.id);
        this.loadDocuments();
        this.loadFeed();
        this.fetchTopEmployers();
        this.fetchTopSkills();
        this.fetchIndustryStats();
      } else {
        this.router.navigate(['/login']); // Redirect if not authenticated
      }
    });
    this.authService.userType$.subscribe(userType => {
      this.userType = userType;
    });
  }
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
  fetchTopEmployers(): void {
    this.http.get<any[]>('/api/dashboard/top-employers').subscribe(data => {
      this.topEmployers = data;
    });
  }

  fetchTopSkills(): void {
    this.http.get<any[]>('/api/dashboard/top-skills').subscribe(data => {
      this.topSkills = data;
    });
  }

  fetchIndustryStats(): void {
    this.http.get<any[]>('/api/dashboard/industry-stats').subscribe(data => {
      this.industries = data;
    });
  }
  selectConversation(conversation: ConversationPreview) {
    this.showMessages = true;
  
    this.http.get<any>(`/api/conversations/${conversation.id}/messages`, {
      params: new HttpParams()
        .set('currentUserId', this.currentUserId)
        .set('page', '0')
        .set('size', '50')
    }).subscribe({
      next: (response) => {
        this.selectedConversation = {
          ...conversation,
          messages: response.content
            .map((msg: any) => ({
              ...msg,
              isCurrentUser: msg.sender.id === this.currentUserId
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
  
  loadStudentInfo(id: number): void {
    this.http.get<InfoDTO>(`/api/students/${id}/info`).subscribe({
      next: (info) => {
        console.log('Loaded student info:', info);  // Log the response
        this.skills = info.skill?.trim() ? info.skill : 'Not specified';
        this.speciality = info.speciality?.trim() ? info.speciality : 'NA';
        this.searchingFor = info.searchType?.trim() ? info.searchType : 'NA';
        this.graduationYear = info.predictedGradYear && info.predictedGradYear !== 0
          ? info.predictedGradYear.toString()
          : '2027';
      },
      error: (error) => {
        console.error('Failed to load student info:', error);
      }
    });
  }
  get fullName(): string {
    if (!this.user) return '';
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  // Ajoutez dans la partie des propriétés
suggestedAlumni = [
  { name: 'Nadia Lauren', connected: false },
  { name: 'Foulena', connected: false },
  { name: 'Hedil Jassi', connected: false },
  { name: 'Alexa Rawles', connected: true },
  { name: 'Mohamed Ali', connected: true }
];
toggleDashboard() {
  // Réinitialisez tous les états
  this.resetAllViews();
  
  // Activez uniquement le dashboard
  this.showDashboard = true;
  console.log('Dashboard activé. État actuel:', {
    showDashboard: this.showDashboard,
    showLatestOffers: this.showLatestOffers,
    showMessages: this.showMessages,
    showDocuments: this.showDocuments
  });
}
private resetAllViews() {
  this.showDashboard = false;
  this.showLatestOffers = false;
  this.showMessages = false;
  this.showDocuments = false;
  this.showEditForm = false;
  this.showAddForm = false;
  this.showMenu = false;
}
// Dans profile.component.ts

topEmployers: any[] = [];
topSkills: any[] = [];
industries: any[] = [];

  // Toggle document form visibility
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.description = '';
      this.selectedFile = null;
    }
  }

  // Toggle edit form visibility
  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
  }

  // Toggle menu visibility
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  // Toggle Latest Offers visibility
  toggleLatestOffers() {
    this.showLatestOffers = !this.showLatestOffers;
    this.showEditForm = false;
    this.showAddForm = false;
    this.showMessages = false;
    this.showDocuments = false; // Hide documents when showing Latest Offers
  }

  // Toggle Messages visibility
  toggleMessages() {
    this.showMessages = !this.showMessages;
    this.showEditForm = false;
    this.showAddForm = false;
    this.showLatestOffers = false;
    this.showDocuments = false; // Hide documents when showing Messages
    this.selectedConversation = null;
  }

  // Toggle Documents visibility
  toggleDocuments() {
    this.showDocuments = !this.showDocuments;
    this.showEditForm = false;
    this.showAddForm = false;
    this.showLatestOffers = false;
    this.showMessages = false;
  }

  // Handle file selection for document upload
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Handle document form submission
  postDocument() {
    if (this.description && this.selectedFile instanceof File && this.user?.id) {
      const formData = new FormData();
  
      const currentDate = new Date(); 
      const isoDate = currentDate.toISOString(); 
  
      formData.append('document', this.selectedFile);
      formData.append('description', this.description);
      formData.append('name', this.selectedFile.name);
      formData.append('date', isoDate);
  
      this.http.post(`/api/student/${this.user.id}/upload-document`, formData, { responseType: 'text' }).subscribe({
        next: () => {
          const formattedDate = currentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
  
          if (this.selectedFile != null) {
            const fileUrl = URL.createObjectURL(this.selectedFile);
            this.documents.push({
              description: this.description,
              fileName: this.selectedFile.name,
              fileType: this.selectedFile.type.includes('pdf') ? 'PDF' : 'FILE',
              date: formattedDate,
              fileUrl: fileUrl
            });
            this.description = '';
            this.selectedFile = null;
            this.showAddForm = false;
          }
        },
        error: (error) => {
          console.error('Document upload failed:', error);
          alert('Failed to upload document');
        }
      });
    } else {
      alert('Please fill all required fields');
    }
  }
  loadDocuments() {
    if (this.user?.id) {
      this.http.get<any[]>(`/api/student/${this.user.id}/documents`).subscribe({
        next: (docs) => {
          this.documents = docs.map(doc => ({
            ...doc,
            fileUrl: doc.downloadUrl 
          }));
        },
        error: (err) => {
          console.error('Error loading document:', err);
        }
      });
    }
  }
  
  updateProfileField(field: 'skills' | 'specialty' | 'searchType' | 'graduationYear') {
    if (!this.user?.id) return;
  
    const formData = new FormData();
  
    if (field === 'skills') {
      formData.append('skills', this.skills || '');
    }
    if (field === 'specialty') {
      formData.append('speciality', this.specialty || '');
    }
    if (field === 'searchType') {
      formData.append('searchType', this.searchingFor || '');
    }
    if (field === 'graduationYear') {
      formData.append('predictedGradYear', this.graduationYear?.toString() || '');
    }
    this.http.put(`/api/student/${this.user.id}/complete-profile`, formData).subscribe({
      next: (updated: any) => {
        console.log(`${field} updated`, updated);
        alert(`${field} updated successfully`);
      },
      error: (err) => {
        console.error(`Error updating ${field}`, err);
        alert(`Failed to update ${field}`);
      }
    });
  }
  
  // Handle adding skills
  addSkill() {
    if (this.skills && this.skills !== 'Not specified') {
      this.skills = this.skills;
      this.updateProfileField('skills');
    }
  }

  // Handle adding specialty
  addSpecialty() {
    if (this.specialty && this.specialty !== 'NA') {
      this.specialty = this.specialty;
      this.updateProfileField('specialty');
    }
  }

  // Handle changing searching for
  changeSearchingFor() {
    if (this.searchingFor && this.searchingFor !== 'NA') {
      this.searchingFor = this.searchingFor;
      this.updateProfileField('searchType');
    }
  }

  // Handle changing graduation year
  changeGraduationYear() {
    if (this.graduationYear && this.graduationYear !== '2027') {
      this.graduationYear = this.graduationYear;
      this.updateProfileField('graduationYear');
    }
  }

  // Handle menu actions
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
  private logDashboardData() {
    console.log('Données du dashboard:', {
      showDashboard: this.showDashboard,
      topEmployers: this.topEmployers,
      topSkills: this.topSkills,
      industries: this.industries,
      suggestedAlumni: this.suggestedAlumni
    });
  }
  feedPosts : Post[]=[];
  loadFeed(): void {
    const userId = this.user?.id;
    if (!userId) {
      alert("User not authenticated");
      return;
    }
  
    this.http.get<any[]>(`http://localhost:8080/api/feed/${userId}`)
      .subscribe({
        next: (data) => {
          this.latestOffers = data.filter(item => item.type === 'Offer');
          this.feedPosts = data.filter(item => item.type === 'Post');
        },
        error: (err) => {
          console.error('Failed to load feed:', err);
          alert("Error loading feed");
        }
      });
  }
}