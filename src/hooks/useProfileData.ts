import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { RetrievedOtherProfileData as PublicProfileData } from "../types/RetrievedOtherProfileData";

const useProfileData = (userId: string | undefined) => {
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
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
        setProfileData(data);
      })
      .catch(error => {
        if (axios.isAxiosError(error)) {
          console.error('Error:', error.message);
        }
      });
  }, [userId]);

  return { profileData };
};

export default useProfileData;