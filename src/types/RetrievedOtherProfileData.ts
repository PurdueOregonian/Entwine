import { Gender } from "./Gender";
import { Location } from "./Location";

export type RetrievedOtherProfileData = {
    username: string;
    age: number;
    gender: Gender;
    interests: number[];
    location: Location;
}