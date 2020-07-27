/**
 *  Reporting-UserLogins
 */
import {User} from "./user.model";
export interface Reporting_ActiveUser {
   count: number, userId: number, username: string, email: string; 
}
export interface Reporting_MostActiveUsers {
    activeUsers: Reporting_ActiveUser[];
}
export interface Reporting_UserVisitsInsignt {
    daily: {count: number, date: string}[],
    weekly: {count: number, date: string}[],
    monthly: {count: number, date: string}[],
    yearly: {count: number, date: string}[]
}