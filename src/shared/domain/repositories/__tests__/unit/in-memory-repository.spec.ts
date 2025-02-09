import { InMemoryRepository } from '../../in-memory-repository';
import { Entity } from '../../../../../shared/domain/entities/entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found-error';
import { userDataBuilder } from '../utils/user-data-builder';

const props = userDataBuilder();

type StubEntityProps = typeof props;
class StubEntity extends Entity<StubEntityProps> {}

class StubRepository extends InMemoryRepository<StubEntity> {}

let sut: StubRepository;
let entity = new StubEntity(props);

describe('InMemoryRepository unit tests', () => {
  beforeEach(() => {
    sut = new StubRepository();
    entity = new StubEntity(props);
  });

  it('should insert a new entity', async () => {
    await sut.insert(entity);

    expect(sut.items).toHaveLength(1);
    expect(sut.items[0].toJson()).toStrictEqual(entity.toJson());
  });

  it('should find an entity by id', async () => {
    await sut.insert(entity);
    const entityFound = await sut.findById(entity.id);

    expect(entityFound.toJson()).toStrictEqual(entity.toJson());
  });

  it('should throw error when not find an entity by id', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found')
    );
  });

  it('should find all entities', async () => {
    await sut.insert(entity);
    const entitiesFound = await sut.findAll();

    expect(entitiesFound).toHaveLength(1);
    expect(entitiesFound[0].toJson()).toStrictEqual(entity.toJson());
  });

  it('should update an entity', async () => {
    await sut.insert(entity);
    const newName = 'new name';
    const newProps = { ...sut.items[0].props, name: newName };
    const id = sut.items[0].id;
    const newEntity = new StubEntity(newProps, id);

    await sut.update(newEntity);

    expect(sut.items[0].toJson()).toStrictEqual(newEntity.toJson());
  });

  it('should delete an entity', async () => {
    await sut.insert(entity);
    await sut.delete(sut.items[0]._id);

    expect(sut.items).toHaveLength(0);
  });
});
