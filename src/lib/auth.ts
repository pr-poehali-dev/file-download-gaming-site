const AUTH_API = 'https://functions.poehali.dev/50b21ac1-ef8a-484e-8d5d-10fd6ba6edf8';
const COMMENTS_API = 'https://functions.poehali.dev/6f5d268c-621f-40b8-9cfd-bfea84774e55';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Comment {
  id: number;
  content: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
  username: string;
  avatar_url: string | null;
  user_id: number;
}

export const authService = {
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export const commentsService = {
  async getComments(fileId: number): Promise<Comment[]> {
    const response = await fetch(`${COMMENTS_API}?file_id=${fileId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load comments');
    return data.comments;
  },

  async createComment(fileId: number, content: string, rating?: number): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(COMMENTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
      body: JSON.stringify({ file_id: fileId, content, rating }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create comment');
  },

  async deleteComment(commentId: number): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${COMMENTS_API}?id=${commentId}`, {
      method: 'DELETE',
      headers: { 'X-Auth-Token': token },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete comment');
  },
};
