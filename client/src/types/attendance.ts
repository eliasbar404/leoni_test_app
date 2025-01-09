export interface Student {
    id: string;
    firstName: string;
    lastName: string;
  }
  
  export interface Group {
    id: string;
    name: string;
    students: Student[];
  }
  
  export interface AttendanceStats {
    totalStudents: number;
    presentStudents: number;
    absentStudents: number;
  }
  
  export interface DailyAttendance {
    present: Student[];
    absent: Student[];
  }