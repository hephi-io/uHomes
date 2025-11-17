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
    localStorage.removeItem('token');
  },
};
