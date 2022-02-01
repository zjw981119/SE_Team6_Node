import User from "../models/User";

/**
 * Declare UserDao interface which contains all the CRUD functions that the concrete class
 * UserDao will implement.
 */
export default interface UserDao{
    findAllUsers(): Promise<User[]>;
    findUserById(uid: string): Promise<User>;
    createUser(user: User): Promise<User>;
    updateUser(uid: string, user: User): Promise<any>;
    deleteUser(uid: string): Promise<any>;
}