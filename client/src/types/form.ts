export interface UserFormData {
    firstName: string;
    lastName: string;
    cin: string;
    matricule: string;
    password: string;
    role: 'FORMATEUR' | 'OPERATEUR';
    image: string;
    address:string;
    gender: 'MALE' | 'FEMALE';
    phone:string;
    groupeId:string|null;
    formateurId:null|string|number;
  }