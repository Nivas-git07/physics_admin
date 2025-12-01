import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Githubcallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const exchangecode = async (code) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/github", {
        code,
      });

      console.log("GitHub Login Response:", response.data);

      
      navigate("/home");
    } catch (error) {
      console.error("GitHub Login Failed:", error.response?.data || error);
    }
  };

  useEffect(()=>{
        const urlprams = new URLSearchParams(window.location.search);
        const code =urlprams.get("code");
        if(code){
            exchangecode(code);
        }
    },[]
);
  return <div>Signing you in with GitHub...</div>;
}
