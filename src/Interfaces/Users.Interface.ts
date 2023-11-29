export class UsersInterface{
    id:number;
    avatar: {
        url: string
    };
    cell_phone:string;
    firstname: string;
    gender: string;
    lastname: string;
    national_id: string;
    personal_code: string;
    post?: string;
    signature: {url: string};
    votable: boolean;
}