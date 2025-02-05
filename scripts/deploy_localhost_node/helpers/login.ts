import axios from "axios";

export const login = async (
  email: string = "user@hardhatchainlink.io",
  password: string = "strongpassword777"
): Promise<string> => {
  try {
    console.info(`\nAuthenticating User ${email} using password ${password}\n`);

    const authResponse = await axios.post(
      "http://127.0.0.1:6688/sessions",
      { email, password },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          referer: "http://127.0.0.1:6688/signin",
        },
      }
    );

    // const response = await fetch("http://127.0.0.1:6688/sessions", {
    //   method: 'POST',
    //   headers: {
    //     'accept': 'application/json',
    //     'content-type': 'application/json',
    //     'referer': 'http://127.0.0.1:6688/signin'
    //   },
    //   body: JSON.stringify({ email, password })
    // });
    
    // const authResponse = await response.json();
    // console.log("authResponse", authResponse)

    if (authResponse.status === 429) {
      throw new Error("Too Many Requests");
    }

    const regex = /clsession=[a-zA-Z0-9=\-_]+/g; // Grab the session token
    const cookies = authResponse.headers["set-cookie"];
    const sessionCookie = cookies?.find((cookie:any) => cookie.match("clsession"));
    const session = sessionCookie?.match(regex);

    if (session !== null && session !== undefined) {
      return session[0];
    } else {
      throw new Error("Authentication cookie not found");
    }
  } catch (err : any) {
    if (err.response) {
      // The request was made and the server responded with a status code
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      console.error('Request data:', err.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error:', err.message);
    }
    return "";
  }
};