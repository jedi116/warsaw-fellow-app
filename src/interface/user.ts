export interface User {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    phonenumber: string;
    birthday: string;
    team: FellowTeam[];
    telegram: string;
    authProvider: string;
    role: string;
}

export type FellowTeam = 'worship' | 'prayer' | 'literature' | 'evangelism' | 'holisticteam' | 'eventOrganization'


export interface UserWithPic extends User {
    profilePicture?: string
}