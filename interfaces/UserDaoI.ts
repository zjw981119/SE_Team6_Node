import User from "../models/User";

/**
 * @file Declares API for users related data access object methods.
 *
 */
export default interface UserDaoI {
    findAllUsers(): Promise<User[]>;
    findUserById(uid: string): Promise<User>;
    createUser(user: User): Promise<User>;
    updateUser(uid: string, user: User): Promise<any>;
    deleteUser(uid: string): Promise<any>;
}