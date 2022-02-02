import User from "../models/User";

/**
 * Declare UserDaoI interface which contains all the CRUD functions that the concrete class
 * UserDaoI will implement.
 */
export default interface UserDaoI {
    findAllUsers(): Promise<User[]>;
    findUserById(uid: string): Promise<User>;
    createUser(user: User): Promise<User>;
    updateUser(uid: string, user: User): Promise<any>;
    deleteUser(uid: string): Promise<any>;
}