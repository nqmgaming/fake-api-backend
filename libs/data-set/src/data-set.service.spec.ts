import { Test, TestingModule } from '@nestjs/testing';
import { DataSetService } from './data-set.service';

interface ICategoryModel {
  name: string;
  description?: string;
  image?: string;
  deleted?: boolean;
}

describe('DataSetService', () => {
  let service: DataSetService<ICategoryModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataSetService],
    }).compile();

    service = module.get<DataSetService<ICategoryModel>>(DataSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all data', () => {
    const fixture = [
      { id: 1, name: 'new category' },
      { id: 2, name: 'new cat' },
      { id: 3, name: 'new' },
    ];
    service.fill(fixture);
    const expected = service.get();
    expect(expected).toStrictEqual(fixture);
  });

  it('should return first element', () => {
    const fixture = [
      { id: 1, name: 'new category' },
      { id: 2, name: 'new cat' },
    ];
    service.fill(fixture);
    const expected = service.first();
    expect(expected).toStrictEqual(fixture[0]);
  });

  it('should return null getting first element', () => {
    const expected = service.first();
    expect(expected).toBeNull();
  });

  it('create dataset should return created data', () => {
    const name = 'new Category 2';
    const fixture = { id: 1, name };
    const expected = service.create({ name });
    expect(expected).toStrictEqual(fixture);
  });

  it('when filter should get first match', () => {
    const fixture = [
      { id: 1, name: 'new category' },
      { id: 2, name: 'new cat' },
      { id: 3, name: 'cat' },
    ];
    service.fill(fixture);
    const expected = service.filter({ id: 2 }).first();
    expect(expected).toStrictEqual(fixture[1]);
  });

  it('when filter should get first match', () => {
    const fixture = [
      { id: 1, name: 'new category' },
      { id: 2, name: 'new cat' },
      { id: 3, name: 'cat' },
    ];
    service.fill(fixture);
    const expected = service.filter({ id: 2 }).first();
    expect(expected).toStrictEqual(fixture[1]);
  });

  it('when filter should get filtered array', () => {
    const fixture = [
      { id: 1, name: 'category' },
      { id: 2, name: 'cat' },
      { id: 3, name: 'cat' },
    ];
    service.fill(fixture);
    const expected = service.filter({ name: 'cat' }).get();
    expect(expected).toStrictEqual([fixture[1], fixture[2]]);
  });

  it('when filter should get filtered array', () => {
    const fixture = [
      { id: 1, name: 'category' },
      { id: 2, name: 'cat' },
      { id: 3, name: 'cat', deleted: true },
    ];
    service.fill(fixture);
    const expected = service.filter({ name: 'cat', deleted: true }).get();
    expect(expected).toStrictEqual([fixture[2]]);
  });

  it('when filter should get filtered array when key exists', () => {
    const fixture = [
      { id: 1, name: 'category', description: 'this is a cat' },
      { id: 2, name: 'cat' },
      { id: 3, name: 'cat', description: 'this is a category1' },
    ];
    service.fill(fixture);
    const expected = service.filter('description').get();
    expect(expected).toStrictEqual([fixture[0], fixture[2]]);
  });

  it('when filter should get filtered array when multiple keys exists', () => {
    const fixture = [
      { id: 1, name: 'category', description: 'this is a cat' },
      { id: 2, name: 'cat', image: 'url' },
      { id: 3, name: 'cat', description: 'this is a category1' },
      { id: 4, name: 'cate', deleted: true, image: 'some url' },
    ];
    service.fill(fixture);
    const expected = service.filter(['image', 'deleted']).get();
    expect(expected).toStrictEqual([fixture[3]]);
  });

  it('when filter should get filtered an empty array when multiple keys exists', () => {
    const fixture = [
      { id: 1, name: 'category', description: 'this is a cat' },
      { id: 2, name: 'cat', image: 'url' },
      { id: 3, name: 'cat', description: 'this is a category1' },
      { id: 4, name: 'cate', deleted: false },
    ];
    service.fill(fixture);
    const expected = service.filter(['description', 'image']).get();
    expect(expected).toStrictEqual([]);
  });

  it('when filter should get filtered array when a key is boolean or null', () => {
    const fixture = [
      { id: 1, name: 'category', deleted: true },
      { id: 2, name: 'cat', deleted: false },
      { id: 3, name: 'cat', deleted: null },
    ];
    service.fill(fixture);
    const expected = service.filter(['deleted']).get();
    expect(expected).toStrictEqual([fixture[0]]);
  });

  it('when filter should get filtered array with function filter', () => {
    const fixture = [
      { id: 1, name: 'category', deleted: true },
      { id: 2, name: 'cat', deleted: false },
      { id: 3, name: 'cat', deleted: null },
    ];
    service.fill(fixture);
    const expected = service
      .filter(
        (value: ICategoryModel) =>
          value.deleted === null || value.deleted === false,
      )
      .get();
    expect(expected).toStrictEqual([fixture[1], fixture[2]]);
  });
});
