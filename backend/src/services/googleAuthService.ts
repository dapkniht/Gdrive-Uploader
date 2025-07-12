import { OAuth2Client } from "google-auth-library";
import { drive_v3 } from "@googleapis/drive";

export class GoogleAuthService {
  private oauth2Client;

  constructor(private accessToken: string, private refreshToken: string) {
    this.oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    });

    this.oauth2Client.setCredentials({
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    });
  }

  /**
   * check if access token is valid
   */
  async checkAccessToken(): Promise<boolean> {
    try {
      await this.oauth2Client.getTokenInfo(this.accessToken);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * get new access token from refresh token
   */
  async getAccessToken(): Promise<string> {
    const tokenResponse = await this.oauth2Client.getAccessToken();

    if (!tokenResponse || !tokenResponse.token) {
      throw new Error("Failed to retrieve access token from refresh token.");
    }

    // update access token
    this.accessToken = tokenResponse.token;
    this.oauth2Client.setCredentials({
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    });

    return this.accessToken;
  }

  /**
   * get google drive client
   */
  getDriveClient(): drive_v3.Drive {
    return new drive_v3.Drive({
      auth: this.oauth2Client,
    });
  }
}
