import { UserRepository } from '@loopback/authentication-jwt';
import { belongsTo, hasMany, hasOne, model, property } from "@loopback/repository";
import { BaseEntity, Location, LocationWithRelations, Organization, OrganizationRelations, Role, UserCredentials } from ".";

@model({
    settings: {
        strict: false,
        indexes: {
            name: {
                keys: { name: 1 },
            },
        }
    }
})
export class User extends BaseEntity {
    @belongsTo(() => User)
    createdById: string;

    @belongsTo(() => User)
    updatedById: string;

    @belongsTo(() => Location)
    countryId: string;

    @belongsTo(() => Location)
    stateId: string;

    @belongsTo(() => Location)
    districtId: string;

    @belongsTo(() => Location)
    subDistrictId: string;

    @belongsTo(() => Organization)
    org: string;

    @property({
        type: "string",
        required: true,
        index: {
            unique: true
        }
    })
    email: string;

    @property({
        type: "string",
    })
    phone: string;

    @property({
        type: 'boolean',
    })
    emailVerified?: boolean;

    @property({
        type: "string",
    })
    name: string;

    @property({
        type: "string",
        required: true,
        default: User.TYPE.CUSTOMER
    })
    type: string;

    @property({
        type: 'string',
    })
    verificationToken?: string;

    @property({
        type: "array",
        itemType: 'string',
    })
    permissions: string[];

    @property({
        type: "array",
        itemType: 'string',
    })
    roleIds: string[];

    @hasOne(() => UserCredentials)
    userCredentials: UserCredentials;

    static TYPE = {
        CUSTOMER: "CUSTOMER",
        ADMIN: "ADMIN",
        STAFF: "STAFF"
    }

    constructor(data?: Partial<User>) {
        super(data)
    }
}

export interface UserRelations {
    country: LocationWithRelations,
    state: LocationWithRelations,
    district: LocationWithRelations,
    subDistrict: LocationWithRelations,
    updatedBy: UserWithRelations,
    createdBy: UserWithRelations,
    org: OrganizationRelations,
}

export type UserWithRelations = UserRepository & User;
