import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { RetrievedOtherProfileData as PublicProfileData } from "../types/RetrievedOtherProfileData";
import { Gender } from "../types/Gender";

const useProfileData = (userId: string | undefined) => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [interests, setInterests] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const apiUrl = userId ? `/Profile/${userId}` : '/Profile';

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
      .then((data: PublicProfileData) => {
        if (data.age === null && data.gender === null) {
          navigate('/NotFound');
        }
        setUsername(data.username);
        setAge(data.age);
        setGender(data.gender ?? null);
        setInterests(data.interests);
        setLoaded(true);
      })
      .catch(error => {
        if (axios.isAxiosError(error)) {
          console.error('Error:', error.message);
        }
      });
  }, [userId]);

  return { username, age, gender, interests, loaded };
};

export default useProfileData;