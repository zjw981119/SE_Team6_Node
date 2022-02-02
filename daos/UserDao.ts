import User from "../models/User";
import UserModel from "../mongoose/users/UserModel";
import UserDaoI from "../interfaces/UserDaoI";

/**
 * Implements Data Access Object managing data storage
 * of users
 * @implements {UserDaoI} UserDaoI
 * @property {UserDao} userDao Private single instance of UserDaoI
 */
export default class UserDao implements UserDaoI {
    private static userDao: UserDao | null = null;

    //use Singleton design pattern
    public static getInstance = (): UserDao => {
        if (UserDao.userDao === null) {
            UserDao.userDao = new UserDao();
        }
        return UserDao.userDao;
    }

    private constructor() {
    }

    findAllUsers = async (): Promise<User[]> =>
        UserModel.find().exec();

    findUserById = async (uid: string): Promise<User> =>
        UserModel.findById(uid).exec();

    createUser = async (user: User): Promise<User> =>
        await UserModel.create(user);

    deleteUser = async (uid: string): Promise<any> =>
        UserModel.deleteOne({_id: uid});

    updateUser = async (uid: string, user: User): Promise<any> =>
        UserModel.updateOne(
            {_id: uid},
            {$set: user});


}