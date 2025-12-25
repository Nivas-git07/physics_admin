import { useEffect } from "react";
import axios from "axios"
import { useSearchParams, useNavigate } from 'react-router-dom';
export default function AuthCallback() {
    const navigate = useNavigate()

    const exchangecode = async (code) => {
        try {
            console.log("it is work");
            const response = await axios.post("https://alsana.selfmade.solutions/api/glogin",
                { code }
            );
            console.log(response.data);
            if(response.ok){
                console.log("google login is successfully");
                navigate("/")

            }
        }
        catch (error) {
            console.log(error);
        }

    };
    useEffect(() => {
        const urlprams = new URLSearchParams(window.location.search);
        const code = urlprams.get("code");
        if (code) {
            exchangecode(code);
        }
    }, []
    );

    return (
        <h2>signing in</h2>
    );
}