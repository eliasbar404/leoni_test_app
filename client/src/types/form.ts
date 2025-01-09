export interface UserFormData {
    firstName: string;
    lastName: string;
    cin: string;
    matricule: string;
    password: string;
    role: 'FORMATEUR' | 'OPERATEUR';
    image: string;
    address:string;
    phone:string;
    groupeId:string|null;
    formateurId:null|string|number;
  }