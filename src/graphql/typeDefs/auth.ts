export default /* GraphQL */ `
  type Tokens {
    accessToken: String
    refreshToken: String
  }

  type User {
    _id: String
    name: String
    email: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  input CreateUserInput {
    name: String
    email: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Query {
    login(input: LoginInput): Tokens
  }

  type Mutation {
    createUser(input: CreateUserInput): Tokens
    login(input: LoginInput): Tokens
    updatePassword(newPassword: String): User
  }
`;
