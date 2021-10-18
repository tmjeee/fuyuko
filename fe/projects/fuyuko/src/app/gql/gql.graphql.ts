import gql from 'nanographql';

export const sampleVersion = gql`
    query version {
        version {
            messages {
                message
            }
        }
    }
`;

export const sampleDeleteCategory = gql`
    mutation deleteCategory($viewId: Int!, $categoryId: Int!) {
        deleteCategory(input: {categoryId: $categoryId, viewId: $viewId}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteDataExportArtifactById = gql`
    mutation deleteDataExportArtifactById($dataExportArtifactId: Int!) {
        deleteDataExportArtifact(input: {dataExportArtifactId: $dataExportArtifactId}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteFavouriteItem = gql`
    mutation deleteFavouriteItems($viewId: Int!, $userId: Int!, $itemIds: [Int!]!) {
        deleteFavouriteItems(input: {viewId: $viewId, userId: $userId, itemIds: $itemIds}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteGroups = gql`
    mutation deleteGroups($groupIds: [Int!]!) {
        deleteGroups(input: {groupIds: $groupIds }) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteCustomRuleFromView = gql`
    mutation deleteCustomRuleFromView($viewId: Int!, $customRuleIds: [Int!]!) {
        deleteCustomRuleFromView(input: {viewId: $viewId, customRuleIds: $customRuleIds}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteRoleFromGroup = gql`
    mutation deleteRoleFromGroup($groupId: Int!, $roleName: String!) {
        deleteRoleFromGroup(input: {groupId: $groupId, roleName: $roleName}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteSelfRegistration = gql`
    mutation deleteSelfRegistration($selfRegistrationId: Int!) {
        deleteSelfRegister(input: {selfRegistrationId: $selfRegistrationId}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteUserById = gql`
    mutation deleteUserById($userId: Int!) {
        deleteUserById(input: {userId: $userId}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteUserFromGroup = gql`
    mutation deleteUserFromGroup($userId: Int!, $groupId: Int!) {
        deleteUserFromGroup(input: {userId: $userId, groupId: $groupId}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteValidationResultById = gql`
    mutation deleteValidationResultById($viewId: Int!, $validationId: Int!) {
        deleteValidationResultById(input: {viewId: $viewId, validationId: $validationId}) {
            messages { status, message }
        }
    }
`;

export const sampleDeleteViewsById = gql`
    mutation deleteViewsById($viewIds: [Int!]!) {
        deleteViewsById(input: {viewIds: $viewIds}) {
            messages { status, message }
        }
    }
`;

export const sampleGetAllAttributesByView = gql`
    query getAllAttributesByView($viewId: Int!, $limit: Int!, $offset: Int!) {
        getAllAttributesByView(input: {viewId: $viewId, limitOffset: { limit: $limit, offset: $offset }}) {
            messages {
                status,
                message
            },
            payload {
                attributes {
                    id, type, name, description, creationDate, lastUpdate, format,
                    showCurrencyCountry,
                    pair1 {
                        id, key, value
                    },
                    pair2 {
                       id, key1, key2, value
                    }
                }
            }
        }
    }
`;

export const sampleGetAllCustomBulkEdits = gql`
    query getAllCustomBulkEdits {
        getAllCustomBulkEdits {
            messages {
                status,
                message
            },
            payload {
                customBulkEdits {
                    creationDate, description, id, lastUpdate, name,
                    inputs {
                        type, name, description,
                        options {
                            key, value
                        }
                    }
                }

            }
        }
    }
`;

export const sampleGetAllCustomExport = gql``;
export const sampleGetAllCustomImport = gql``;
export const sampleGetAllCustomRules = gql``;
export const simpleGetAllCustomRulesByView = gql``;
export const sampleGetAllDataExportArtifacts = gql``;
export const sampleGetAllFavouriteItemIds = gql``;
