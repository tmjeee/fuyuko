/**
 *  Reporting-active-users
 */
import {AttributeType} from "./attribute.model";

export interface Reporting_ActiveUser {
   count: number, userId: number, username: string, email: string; 
}
export interface Reporting_MostActiveUsers {
    activeUsers: Reporting_ActiveUser[];
}

/**
 *  Reporting-user-visits-insights
 */
export interface Reporting_UserVisitsInsignt {
    daily: {count: number, date: string}[],
    weekly: {count: number, date: string}[],
    monthly: {count: number, date: string}[],
    yearly: {count: number, date: string}[]
}


/**
 * Reporting-missing-attribute-values
 */
export interface Reporting_ItemsWithMissingAttributeInfo {
    views: Reporting_ViewWithMissingAttribute[];
}
export interface Reporting_ViewWithMissingAttribute {
    totalItemsWithMissingAttributes: number,
    totalMissingAttributes: number,
    viewId: number,
    viewName: string,
    items: Reporting_ItemWithMissingAttribute[]
}
export interface Reporting_ItemWithMissingAttribute {
    totalMissingAttributes: number,
    itemId: number,
    itemName: string,
    viewId: number,
    viewName: string,
    attributes: Reporting_MissingAttribute[]
}
export interface Reporting_MissingAttribute {
    attributeId: number;
    attributeName: string;
    attributeType: AttributeType
}

/**
 * Reporting - view validation summary
 */
export interface Reporting_ViewValidationSummary {
    validationId: number;
    validationName: string;
    viewId: number;
    viewName: string;
    totalItems: number;
    totalWithWarnings: number;
    totalWithErrors: number;
}

/**
 * Reporting - view validation range summary
 */
export interface Reporting_ViewValidationRangeSummary {
    range: Reporting_ViewValidationSummary[]
}

/**
 * Reporting - attributes errors summary
 */
export interface Reporting_ViewAttributeValidationSummary {
    viewId: number;
    viewName: string;
    validationId: number;
    validationName: string;
    attributes: {
      attributeId: number,
      attributeName: string,
      errors: number,
      warnings: number
    }[]
}

export interface Reporting_ViewAttributeValidationRangeSummary {
    viewId: number;
    viewName: string;
    ranges: {
        validationId: number,
        validationName: string,
        totalAttributeErrors: number,
        totalAttributeWarnings: number
    }[];
}


