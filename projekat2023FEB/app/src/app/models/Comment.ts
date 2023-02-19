import { User } from "./user";
import { Workshop } from "./workshop";

export class Comment {
    _id: string;
    sender: User;
    workshop: Workshop;
    content: string;
    timestamp: string;
    editing: boolean;
}