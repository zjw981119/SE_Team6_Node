/**
 * @file Declares API for users related data access object methods.
 *
 */
import User from "../../models/users/User";

export default interface UserDaoI {
    findAllUsers(): Promise<User[]>;
    findAllContacts(uid: string): Promise<User[]>;
    findUserById(uid: string): Promise<User>;
    createUser(user: User): Promise<User>;
    updateUser(uid: string, user: User): Promise<any>;
    deleteUser(uid: string): Promise<any>;
}