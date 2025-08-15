export interface UserDTO {
    firstName: string;
    lastName: string;
    email: string;
    companyId: string;
    phoneNumber: string;
}

export interface User extends UserDTO {
    id: string;
    active: boolean;
    createdAt: string;
}

export interface CompanyDTO {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
}

export interface Company extends CompanyDTO {
    id: string;
    active: boolean;
}
