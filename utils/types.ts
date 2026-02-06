export interface DashboardPropType {
    children: React.ReactNode;
}

export interface SignUpFromType {
    name: String,
    email: String,
    password: String,
    phone: String,
}
export interface SignInFromType {
    email: String,
    password: String,
}

export interface ShowErrorType {
    message?: String 
}