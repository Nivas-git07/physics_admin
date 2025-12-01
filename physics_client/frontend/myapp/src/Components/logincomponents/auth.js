// import GoogleLogin from "react-google-login";


export default function Auth(){
    const GoogleLogin=()=>{
    const clientId = "555593931453-74490tt0nfful2snbir90mo5okgrbi5p.apps.googleusercontent.com";
    const redirectUri = "http://localhost:3000/auth/callback";
    const scope = ["openid","email","profile"].join(" ");
    const accessType = "offline";
    // const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=${accessType}`;
    const url = `https://accounts.google.com/o/oauth2/v2/auth
      ?response_type=code
      &client_id=${clientId}
      &redirect_uri=${redirectUri}
      &scope=${scope}
      &access_type=offline
      &prompt=consent`
      .replace(/\n/g, "")
      .replace(/  +/g, "");
    window.location.href = url;

  }
  const githubLogin = () => {
    const GITHUB_CLIENT_ID ="Ov23liRPnvh6efoxBlzP";
    const REDIRECT_URI = "http://localhost:3000/auth/github/callback";
    const scope ='user:email';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  }
    return(
          <div>
          <div className="divider">
  <span></span>
  <p>or Continue with</p>
  <span></span>
</div>

<div className="social-row">
  <button onClick={GoogleLogin}>
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
      alt="Google"
    />
  </button>

  <button onClick={githubLogin}>
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
      alt="GitHub"
    />
  </button>

  <button>
    <img
      src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png"
      alt="Facebook"
    />
  </button>
</div>

          </div>   
    )
}