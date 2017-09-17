import { AuthenticationType } from "../Enums/AuthenticationType";

export class Auth {
    public key: string;
    
    public type: AuthenticationType;

    public roles: string;
}