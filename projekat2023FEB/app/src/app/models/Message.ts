import { User } from "./user";
import { Workshop } from "./workshop";

export class Message {
    sender: User;
    recipient: User;
    content: string;
    timestamp: string;
    workshop: Workshop
}