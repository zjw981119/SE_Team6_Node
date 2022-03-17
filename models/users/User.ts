import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";

/**
 * @class User Represents all important information of user account.
 * @property {String} username user's account name
 * @property {String} password user's account password
 * @property {String} firstName user's first name
 * @property {String} lastName user's last name
 * @property {String} email user's email
 * @property {String} profilePhoto user's profile photo
 * @property {String} headerImage user's header image
 * @property {String} accountType user's account type
 * @property {String} maritalStatus user's marital status
 * @property {String} biography user's biography
 * @property {Date} dateOfBirth user's birthday
 * @property {Date} joined user account's creation time
 * @property {Location} location user's location
 *
 */
export default class User {
    username: string = '';
    password: string = '';
    firstName: string | null = null;
    lastName: string | null = null;
    email: string = '';
    profilePhoto: string | null = null;
    headerImage: string | null = null;
    accountType: AccountType = AccountType.Personal;
    maritalStatus: MaritalStatus = MaritalStatus.Single;
    biography: string | null = null;
    dateOfBirth: Date | null = null;
    joined: Date = new Date();
    location: Location | null = null;
}