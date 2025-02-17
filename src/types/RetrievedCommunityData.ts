import { CommunityChatData } from "./CommunityChatData";

export type RetrievedCommunityData = {
    city: string;
    state?: string;
    country: string;
    userIds: number[];
    chats: CommunityChatData[];
}