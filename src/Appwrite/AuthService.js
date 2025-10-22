import { Client, Account, ID } from "appwrite"; //Getting User acess from Appwrite
import conf from "../Data_management/conf/conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    console.log("Appwrite URL:", conf.appwriteURL);
    this.client
      .setEndpoint(conf.appwriteURL)
      .setProject(conf.appwriteProjectID);

    this.account = new Account(this.client);
  }


  async createAccount({ email, password, name }) {
    try {
      console.log("Creating a new account for:", email);

      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      console.log("Account created successfully!");
      return this.login({ email, password });
    } catch (error) {
      console.error("Sign Up Error:", error.message);
      throw error;
    }
  }


  async login({ email, password }) {
    try {
      console.log("Attempting login...");


      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      if (error.code === 401) return null; 
      console.error("GetCurrentUser Error:", error.message);
      throw error;
    }
  }

  async logout() {
    try {
      console.log("Logging out...");
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Logout Error:", error.message);
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;
