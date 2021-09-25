import gql from 'nanographql';

export const testgql = gql`
    query version {
        version {
            messages {
                message
            }
        }
    }
`;
