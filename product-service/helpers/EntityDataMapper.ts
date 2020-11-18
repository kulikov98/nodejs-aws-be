export abstract class EntityDataMapper {
    static toDomain(entity: any) {
        return entity;
    }

    static toDalEntity(domain: any) {
        return domain;
    }
}