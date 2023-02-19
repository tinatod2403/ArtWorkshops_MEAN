import { Message } from "./Message";

export class MessageReqest {
    senderUsername: string;
    senderPicture: string;

    workshopID: string;
    workshopName: string;

    messages: Array<Message>;

    opened: boolean;
    beenOpened: boolean;
}