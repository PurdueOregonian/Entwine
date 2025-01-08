import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { backendUrl } from './constants/constants';
import { axiosPrivate } from './api/axios';

interface StaticDataContextType {
    interestMap: Map<number, Interest>;
    interestCategoryMap: Map<number, InterestCategory>;
}

const StaticDataContext = createContext<StaticDataContextType>({
    interestMap: new Map(),
    interestCategoryMap: new Map()
});
interface StaticDataProviderProps {
    children: ReactNode;
}

export const StaticDataProvider: React.FC<StaticDataProviderProps> = ({ children }) => {
    const [interests, setInterests] = useState<Map<number, Interest>>(new Map());
    const [interestCategories, setInterestCategories] = useState<Map<number, InterestCategory>>(new Map());

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await axiosPrivate.get(`${backendUrl}/Interest`);
                const interestsData: Interest[] = response.data;
                const interestsMap = new Map(interestsData.map(interest => [interest.id, interest]));
                setInterests(interestsMap);
            } catch (error) {
                console.error('Error fetching interests:', error);
            }
        };

        const fetchInterestCategories = async () => {
            try {
                const response = await axiosPrivate.get(`${backendUrl}/Interest/Category`);
                const categoriesData: InterestCategory[] = response.data;
                const categoriesMap = new Map(categoriesData.map(category => [category.id, category]));
                setInterestCategories(categoriesMap);
            } catch (error) {
                console.error('Error fetching interest categories:', error);
            }
        };

        fetchInterests();
        fetchInterestCategories();
    }, []);
    return (
        <StaticDataContext.Provider value={{ interestMap: interests, interestCategoryMap: interestCategories }}>
            {children}
        </StaticDataContext.Provider>
    );
};

export default StaticDataContext;