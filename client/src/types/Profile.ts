export interface ProfileData {
    firstName: string;
    lastName: string;
    cin: string;
    matricule: string;
    role:string;
    image: string|null;
    phone:string;
    address:string;
    formateur?:string|null;
    groupe?:string;
    groupeId?:string;
  }
  
  export interface PasswordData {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }