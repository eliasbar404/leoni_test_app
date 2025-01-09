export interface User {
    id: string;
    firstName: string;
    lastName: string;
    cin: string;
    matricule: string;
    role: 'FORMATEUR' | 'OPERATEUR' | 'ADMIN';
    image: string;
    address?:string;
    phone?:string;
    formateurId?:number|null;
    formateur?:string;
    groups?:string|null;

}