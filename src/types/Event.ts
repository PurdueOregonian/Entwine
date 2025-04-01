export type Event = {
    id: number;
    community: number;
    startTime: string;
    endTime: string;
    organizerId: number;
    name?: string;
    userIds?: number[];
    maxParticipants: number;
}