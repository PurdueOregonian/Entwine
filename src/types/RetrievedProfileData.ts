import { Gender } from "./Gender";
import { Location } from "./Location";

export type RetrievedProfileData = {
    dateOfBirth: string;
    gender: Gender;
    interests: number[];
    location: Location;
}