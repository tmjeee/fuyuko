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

export type GqlNoWorkflowConfigured = {
  __typename?: 'GqlNoWorkflowConfigured';
  type: Scalars['String'];
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
};


export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryInput;
};

export type Query = {
  __typename?: 'Query';
  version: VersionOutput;
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
