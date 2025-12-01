import { useEffect } from "react";
import axios from "axios"
import { useSearchParams, useNavigate } from 'react-router-dom';
export default function AuthCallback(){
    
const exchangecode = async (code)=>{
    try{
    const response = await axios.post("http://localhost:5000/glogin",
        {code}
    );
    console.log(response.data);
}
catch(error){
    console.log(error);
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

return(
    <h2>signing in</h2>
);
}