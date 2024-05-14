export interface AdminSignupDetails {

    FullName: string;
    Email: string;
    Gender: string;
    DateOfBirth: Date | null;
    NID: string;
    Phone: string;
    Address: string;
    picture: File | null;
}