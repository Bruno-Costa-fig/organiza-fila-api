import { Model, ModelStatic } from 'sequelize';

async function getAll<T extends Model>(model: ModelStatic<T>) {
  return model.findAll();
}

async function getById<T extends Model>(model: ModelStatic<T>, id: string | number) {
  return model.findByPk(id);
}

async function getWhere<T extends Model>(model: ModelStatic<T>, atrinute: string, value: string | number) {
  // @ts-ignore
  return model.findOne({ where: { [atrinute]: value } });
}

async function create<T extends Model>(model: ModelStatic<T>, data: Partial<T['_attributes']>) {
  // @ts-ignore
  return model.create(data);
}

async function update<T extends Model>(model: ModelStatic<T>, id: string | number, data: Partial<T['_attributes']>) {
  // @ts-ignore
  return model.update(data, { where: { id } });
}

async function remove<T extends Model>(model: ModelStatic<T>, id: string | number) {
  // @ts-ignore
  return model.destroy({ where: { id } });
}

export {
  getAll,
  getById,
  getWhere,
  create,
  update,
  remove,
};