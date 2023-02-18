import { User } from "./user";
import { Workshop } from "./workshop";

export class Comment {
    sender: User;
    workshop: Workshop;
    content: string;
    timestamp: string;
}