export class Users {
  constructor({ userId, fullName, userName, password,created_date }) {
    this.userId = userId
    this.fullName = fullName
    this.userName = userName
    this.password=password
    this.created_date = created_date
  }
}