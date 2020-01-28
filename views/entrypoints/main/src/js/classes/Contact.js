import Factory from './Factory';
import { getRandomHexColor, randomUUID } from '../helpers/utilsHelper';
import { isIterable } from '../helpers/checkHelper';
import _isEmpty from 'lodash/isEmpty';

// IN: obj
// FROM: json obj from server, old inst, example empty obj
// obj = {
//     id | _id: string.isRequired,
//     cbookId | adrsbookid | adrsbook_id: string.isRequired,
//     accId | accountid | account_id: string.isRequired,
//     name: string.default(null),
//     labels: iterable.default(null),
//     birth: string.default(null),
//     note: string.default(null),
//     email: string.default(null),
//     website: : string.default(null),
//     phones: string.default(null),
//     phone: string.default(null),
//     color: string.default(null),
//     avatarURL: string.default(null),
//     hpbd: bool.default(false),
// };

// OUT: obj
// HOW: new Contact() | Contact.fromJSON() | Contact.fromScratch()
// obj = {
//     id: <stringwq></stringwq>,
//     cbookId: string.jsonizable,
//     accId: string.jsonizable,
//     name: string.jsonizable,
//     labels: array.default(emptyArray).jsonizable,
//     birth: string.jsonizable,
//     note: string.jsonizable,
//     email: string.jsonizable,
//     website: string.jsonizable,
//     phones: string.jsonizable,
//     phone: string.jsonizable,
//     color: string.jsonizable,
//     avatarURL: string.jsonizable,
//     isMarked: string,
//     hpbd: bool,
// }

class Contact extends Factory {
  constructor (rawData) {
    super(rawData);
    this._id = rawData.id || rawData._id;
    // this.id = rawData.id;
    this.cbookId = rawData.cbookId || null;
    this.accId = rawData.accId || null;
    this.name = rawData.name || '';
    this._labels = new Set(rawData.labels);
    this.birth =
      rawData.birth instanceof Date
        ? rawData.birth
        : typeof rawData.birth === 'string'
          ? new Date(Date.parse(rawData.birth))
          : null;
    this.note = rawData.note || '';
    this.email = rawData.email || '';
    this.website = rawData.website || '';
    // this.phones =
    //   Array.isArray(rawData.phones) && !_isEmpty(rawData.phones)
    //     ? rawData.phones
    //     : [
    //       {
    //         id: randomUUID(),
    //         callingCode: '',
    //         phoneNumb: '',
    //       },
    //     ];
    this.phone = _isEmpty(rawData.phone)
      ? {
        id: randomUUID(),
        callingCode: '',
        phoneNumb: '',
      }
      : rawData.phone;
    this.color = rawData.color || null;
    this.avatarURL = rawData.avatarURL || null;
    this.isMarked = rawData.isMarked || false;
    this.hpbd = rawData.hpbd || false;
    [
      'id',
      'cbookId',
      'accId',
      'name',
      'labels',
      'birth',
      'note',
      'email',
      'website',
      // 'phones',
      'phone',
      'color',
      'avatarURL',
    ].forEach((keyname) => {
      this._isSerializable = this._isSerializable.add(keyname);
    });
  }

  toJSON () {
    // because Date obj has toJSON() method as well,
    // we must not call that method on Date obj as we are doing in toJSON() method,
    // see super.toJSON()
    const birth = this.birth;
    const json = super.toJSON();
    json.birth = birth;
    return json;
  }

  static fromJSON (data) {
    return super.fromJSON(data);
  }

  // static create (rawData) {
  //     return new Contact(rawData);
  // }

  static fromScratch (base) {
    if (base && isIterable(base)) {
      throw new Error('Contact.fromscratch() does not receive iterable obj');
    }
    return this.fromJSON({
      name: '',
      labels: [],
      note: '',
      email: '',
      website: '',
      // phones: [
      //   {
      //     id: randomUUID(),
      //     callingCode: '',
      //     phoneNumb: '',
      //   },
      // ],
      phone: {
        id: randomUUID(),
        callingCode: '',
        phoneNumb: '',
      },
      ...base,
      id: randomUUID(), // use uuid created in database
      color: getRandomHexColor(),
      // birth: new Date()// does not have to init default birthday value
    });
  }

  // get & set props will not be passed through, therefore we have to set this.id in constructor() (line 6)
  get id () {
    return this._id;
  }

  get labels () {
    return Array.from(this._labels);
  }

  set labels (labels) {
    if (isIterable(labels)) {
      this._labels = new Set(labels);
    }
  }
}

export default Contact;
