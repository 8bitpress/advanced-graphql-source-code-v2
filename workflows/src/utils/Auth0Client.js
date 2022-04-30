import fetch from "node-fetch";
import jwtDecode from "jwt-decode";

class Auth0Client {
  constructor({ audience, clientId, clientSecret, domain }) {
    this.audience = audience;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.domain = domain;
    this.cache = {};
  }

  getToken = async () => {
    const clientId = this.clientId;
    const cachedToken = this.cache[clientId];

    if (cachedToken) {
      const decodedToken = jwtDecode(cachedToken);
      const expiresAt = decodedToken.exp * 1000;
      const isAuthenticated = expiresAt
        ? new Date().getTime() < expiresAt
        : false;

      if (isAuthenticated) {
        return cachedToken;
      }
    }

    const options = {
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        audience: this.audience,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials"
      })
    };

    const response = await fetch(`https://${this.domain}/oauth/token`, options);
    const body = await response.json();
    const { access_token } = body;

    if (!access_token) {
      throw new Error(
        body.error_description || "Cannot retrieve access token."
      );
    }

    this.cache[clientId] = access_token;

    return access_token;
  };
}

export default Auth0Client;
