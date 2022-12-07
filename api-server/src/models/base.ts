import { Entity, property } from "@loopback/repository";

export abstract class BaseEntity extends Entity {
    @property({
        type: "string",
        mongodb: { dataType: "ObjectId" },
        id: true,
    })
    id: string;

    orgId: string;
    createdById: string
    updatedById: string
    sharingWithOrgIds: string[];
    sharingWithUserIds: string[];

    @property({
        type: 'Date',
    })
    createdAt: Date;

    @property({
        type: 'Date',
    })
    updatedAt: Date;
}
