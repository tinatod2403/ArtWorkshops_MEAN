import { Message } from "./Message";

export class MessageReqest {
    senderUsername: string;
    senderPicture: string;
    messages: Array<Message>;
    opened: boolean;
    beenOpened: boolean;
}