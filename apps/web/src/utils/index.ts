export const token = {
  getToken() {
    return localStorage.getItem('token');
  },
  isAuthenticated() {
    return !!this.getToken();
  },
  login(token: string) {
    localStorage.setItem('token', token);
  },
  logout() {
    // Clear all auth-related localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('signupEmail');
    // Clear any other auth-related items if needed
  },
  clearAll() {
    // Clear all auth-related localStorage items
    this.logout();
  },
};
