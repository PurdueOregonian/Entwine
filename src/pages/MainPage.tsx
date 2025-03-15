import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { CommunityChatData } from "../types/CommunityChatData";
import axios from "axios";
import CommunityChat from "../components/CommunityChat";
import { RetrievedCommunityData } from "../types/RetrievedCommunityData";

function MainPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chats, setChats] = useState<CommunityChatData[]>([]);
    useEffect(() => {
        const apiUrl = '/Community';

        axiosPrivate.get(apiUrl, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((data: RetrievedCommunityData) => {
                setLoading(false);
                setChats(data.chats);
            })
            .catch(error => {
                setLoading(false);
                if (error.status === 404) {
                    setError('No community chat available. Please set a location in your profile.');
                }
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    }, [])

    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;
    
    return (
        <>
            <CommunityChat
                chats={chats}
            />
        </>
    );
}

export default MainPage;