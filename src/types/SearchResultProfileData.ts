import { Gender } from "./Gender";

export type SearchResultProfileData = {
    id: number;
    username: string;
    dateOfBirth: string;
    gender: Gender;
}