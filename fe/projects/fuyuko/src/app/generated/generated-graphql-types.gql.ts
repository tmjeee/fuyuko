export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
 import {ResponseStatus} from '@fuyuko-common/model/api-response-status.model'; 
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AttributeType: any;
  DateTime: any;
  NoWorkflowConfiguredTypeScalar: any;
  ResponseStatus: ResponseStatus;
};

export type DeleteCategoryInput = {
  categoryId: Scalars['Float'];
  viewId: Scalars['Float'];
};

export type DeleteCategoryOutput = {
  __typename?: 'DeleteCategoryOutput';
  messages: Array<GqlResponseMessage>;
  payload: DeleteCategoryOutputPayload;
};

export type DeleteCategoryOutputPayload = {
  __typename?: 'DeleteCategoryOutputPayload';
  isWorkflow: Scalars['Boolean'];
  workflows: Array<WorkflowTriggerResultUnion>;
};

export type DeleteCustomRuleFromViewInput = {
  customRuleIds: Array<Scalars['Int']>;
  viewId: Scalars['Float'];
};

export type DeleteCustomRuleFromViewOutput = {
  __typename?: 'DeleteCustomRuleFromViewOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteDataExportArtifactInput = {
  dataExportArtifactId: Scalars['Float'];
};

export type DeleteDataExportArtifactOutput = {
  __typename?: 'DeleteDataExportArtifactOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteFavouriteItemsInput = {
  itemIds: Array<Scalars['Int']>;
  userId: Scalars['Float'];
  viewId: Scalars['Float'];
};

export type DeleteFavouriteItemsOutput = {
  __typename?: 'DeleteFavouriteItemsOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteGroupsInput = {
  groupIds: Array<Scalars['Int']>;
};

export type DeleteGroupsOutput = {
  __typename?: 'DeleteGroupsOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteItemFromCategoryInput = {
  categoryId: Scalars['Float'];
  itemId: Scalars['Float'];
  viewId: Scalars['Float'];
};

export type DeleteItemFromCategoryOutput = {
  __typename?: 'DeleteItemFromCategoryOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteRoleFromGroupInput = {
  groupId: Scalars['Float'];
  roleName: Scalars['String'];
};

export type DeleteRoleFromGroupOutput = {
  __typename?: 'DeleteRoleFromGroupOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteSelfRegistrationInput = {
  selfRegistrationId: Scalars['Float'];
};

export type DeleteSelfRegistrationOutput = {
  __typename?: 'DeleteSelfRegistrationOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteUserByIdInput = {
  userId: Scalars['Float'];
};

export type DeleteUserByIdOutput = {
  __typename?: 'DeleteUserByIdOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteUserFromGroupInput = {
  groupId: Scalars['Float'];
  userId: Scalars['Float'];
};

export type DeleteUserFromGroupOutput = {
  __typename?: 'DeleteUserFromGroupOutput';
  messages: Array<GqlResponseMessage>;
};

export type DeleteValidationResultByIdInput = {
  validationId: Scalars['Float'];
  viewId: Scalars['Float'];
};

export type DeleteValidationResultByIdOutput = {
  __typename?: 'DeleteValidationResultByIdOutput';
  messages: Array<GqlResponseMessage>;
};

export type GetAllAttributesByViewInput = {
  limitOffset?: Maybe<GqlLimitOffset>;
  viewId: Scalars['Int'];
};

export type GetAllAttributesByViewOutput = {
  __typename?: 'GetAllAttributesByViewOutput';
  limit: Scalars['Float'];
  messages: Array<GqlResponseMessage>;
  offset: Scalars['Float'];
  payload: GetAllAttributesByViewOutputPayload;
  total: Scalars['Float'];
};

export type GetAllAttributesByViewOutputPayload = {
  __typename?: 'GetAllAttributesByViewOutputPayload';
  attributes: Array<GqlAttribute>;
};

export type GqlAttribute = {
  __typename?: 'GqlAttribute';
  creationDate: Scalars['DateTime'];
  description: Scalars['String'];
  format: Scalars['String'];
  id: Scalars['Int'];
  lastUpdate: Scalars['DateTime'];
  name: Scalars['String'];
  pair1: Array<GqlPair1>;
  pair2: Array<GqlPair2>;
  showCurrencyCountry: Scalars['Boolean'];
  type: Scalars['AttributeType'];
};

export type GqlLimitOffset = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type GqlNoWorkflowConfigured = {
  __typename?: 'GqlNoWorkflowConfigured';
  type: Scalars['NoWorkflowConfiguredTypeScalar'];
};

export type GqlPair1 = {
  __typename?: 'GqlPair1';
  id: Scalars['Int'];
  key: Scalars['String'];
  value: Scalars['String'];
};

export type GqlPair2 = {
  __typename?: 'GqlPair2';
  id: Scalars['Int'];
  key1: Scalars['String'];
  key2: Scalars['String'];
  value: Scalars['String'];
};

export type GqlResponseMessage = {
  __typename?: 'GqlResponseMessage';
  message: Scalars['String'];
  status: Scalars['ResponseStatus'];
};

export type GqlWorkflowInstanceCreated = {
  __typename?: 'GqlWorkflowInstanceCreated';
  type: Scalars['String'];
  workflowInstanceId: Scalars['Float'];
};

export type GqlWorkflowTriggerError = {
  __typename?: 'GqlWorkflowTriggerError';
  message: Scalars['String'];
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteCategory: DeleteCategoryOutput;
  deleteCustomRuleFromView: DeleteCustomRuleFromViewOutput;
  deleteDataExportArtifact: DeleteDataExportArtifactOutput;
  deleteFavouriteItems: DeleteFavouriteItemsOutput;
  deleteGroups: DeleteGroupsOutput;
  deleteItemFromCategory: DeleteItemFromCategoryOutput;
  deleteRoleFromGroup: DeleteRoleFromGroupOutput;
  deleteSelfRegister: DeleteSelfRegistrationOutput;
  deleteUserById: DeleteUserByIdOutput;
  deleteUserFromGroup: DeleteUserFromGroupOutput;
  deleteValidationResultById: DeleteValidationResultByIdOutput;
};


export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryInput;
};


export type MutationDeleteCustomRuleFromViewArgs = {
  input: DeleteCustomRuleFromViewInput;
};


export type MutationDeleteDataExportArtifactArgs = {
  input: DeleteDataExportArtifactInput;
};


export type MutationDeleteFavouriteItemsArgs = {
  input: DeleteFavouriteItemsInput;
};


export type MutationDeleteGroupsArgs = {
  input: DeleteGroupsInput;
};


export type MutationDeleteItemFromCategoryArgs = {
  input: DeleteItemFromCategoryInput;
};


export type MutationDeleteRoleFromGroupArgs = {
  input: DeleteRoleFromGroupInput;
};


export type MutationDeleteSelfRegisterArgs = {
  input: DeleteSelfRegistrationInput;
};


export type MutationDeleteUserByIdArgs = {
  input: DeleteUserByIdInput;
};


export type MutationDeleteUserFromGroupArgs = {
  input: DeleteUserFromGroupInput;
};


export type MutationDeleteValidationResultByIdArgs = {
  input: DeleteValidationResultByIdInput;
};

export type Query = {
  __typename?: 'Query';
  getAllAttributesByView: GetAllAttributesByViewOutput;
  version: VersionOutput;
};


export type QueryGetAllAttributesByViewArgs = {
  input: GetAllAttributesByViewInput;
};

export type VersionOutput = {
  __typename?: 'VersionOutput';
  messages: Array<GqlResponseMessage>;
  payload: VersionOutputPayload;
};

export type VersionOutputPayload = {
  __typename?: 'VersionOutputPayload';
  test: Scalars['String'];
};

export type WorkflowTriggerResultUnion = GqlNoWorkflowConfigured | GqlWorkflowInstanceCreated | GqlWorkflowTriggerError;

export type VersionQueryVariables = Exact<{ [key: string]: never; }>;


export type VersionQuery = { __typename?: 'Query', version: { __typename?: 'VersionOutput', messages: Array<{ __typename?: 'GqlResponseMessage', message: string }> } };
