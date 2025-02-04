import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

const { FRONT_DATABASE_URI } = process.env;

const front_sequelize = new Sequelize(FRONT_DATABASE_URI as string); // TODO: type process.env

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  // declare provider: string | null;
  // declare providerId: string | null;
  declare githubId: string;
  declare username: string;
  declare email: string;
  declare name: string;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // provider: {
    //   type: DataTypes.STRING,
    // },
    // providerId: {
    //   type: DataTypes.STRING,
    // },
    githubId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "user",
    sequelize: front_sequelize,
    indexes: [
      { fields: ["githubId"] },
      { fields: ["username"] },
      // { fields: ["provider", "providerId"] },
    ],
  }
);

export class App extends Model<
  InferAttributes<App>,
  InferCreationAttributes<App>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare uId: string;
  declare sId: string;
  declare name: string;
  declare description: string;
  declare visibility: string;
  declare savedSpecification: string;
  declare savedConfig: string;
  declare savedRun: string;
  declare dustAPIProjectId: string;

  declare userId: ForeignKey<User["id"]>;
}
App.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    uId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    savedSpecification: {
      type: DataTypes.TEXT,
    },
    savedConfig: {
      type: DataTypes.TEXT,
    },
    savedRun: {
      type: DataTypes.TEXT,
    },
    dustAPIProjectId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "app",
    sequelize: front_sequelize,
    indexes: [
      { fields: ["userId", "visibility"] },
      { fields: ["userId", "sId", "visibility"] },
    ],
  }
);
User.hasMany(App);

export class Provider extends Model<
  InferAttributes<Provider>,
  InferCreationAttributes<Provider>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare providerId: string;
  declare config: string;

  declare userId: ForeignKey<User["id"]>;
}
Provider.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    config: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    modelName: "provider",
    sequelize: front_sequelize,
    indexes: [{ fields: ["userId"] }],
  }
);
User.hasMany(Provider);

export class Dataset extends Model<
  InferAttributes<Dataset>,
  InferCreationAttributes<Dataset>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;
  declare description: string;

  declare userId: ForeignKey<User["id"]>;
  declare appId: ForeignKey<App["id"]>;
}
Dataset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    modelName: "dataset",
    sequelize: front_sequelize,
    indexes: [{ fields: ["userId", "appId", "name"] }],
  }
);
User.hasMany(Dataset);
App.hasMany(Dataset);

export class Clone extends Model<
  InferAttributes<Clone>,
  InferCreationAttributes<Clone>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare fromId: number;
  declare toId: number;
}
Clone.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fromId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "apps",
        key: "id",
      },
    },
    toId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "apps",
        key: "id",
      },
    },
  },
  {
    modelName: "clone",
    sequelize: front_sequelize,
  }
);
Clone.belongsTo(App, { as: "from", foreignKey: "fromId" });
Clone.belongsTo(App, { as: "to", foreignKey: "toId" });

export class Key extends Model<
  InferAttributes<Key>,
  InferCreationAttributes<Key>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare secret: string;
  declare status: string;

  declare userId: ForeignKey<User["id"]>;
}
Key.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "keys",
    sequelize: front_sequelize,
    indexes: [{ unique: true, fields: ["secret"] }, { fields: ["userId"] }],
  }
);
User.hasMany(Key);

export class DataSource extends Model<
  InferAttributes<DataSource>,
  InferCreationAttributes<DataSource>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;
  declare description?: string;
  declare visibility: string;
  declare config?: string;
  declare dustAPIProjectId: string;

  declare userId: ForeignKey<User["id"]>;
}

DataSource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    config: {
      type: DataTypes.TEXT,
    },
    dustAPIProjectId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "data_source",
    sequelize: front_sequelize,
    indexes: [
      { fields: ["userId", "visibility"] },
      { fields: ["userId", "name", "visibility"] },
    ],
  }
);
User.hasMany(DataSource);

// XP1

const { XP1_DATABASE_URI } = process.env;
const xp1_sequelize = new Sequelize(XP1_DATABASE_URI as string);

export class XP1User extends Model<
  InferAttributes<XP1User>,
  InferCreationAttributes<XP1User>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare name: string;
  declare email: string;
  declare secret: string;
}

XP1User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "user",
    sequelize: xp1_sequelize,
    indexes: [{ fields: ["secret"] }],
  }
);

export class XP1Run extends Model<
  InferAttributes<XP1Run>,
  InferCreationAttributes<XP1Run>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare dustUser: string;
  declare dustAppId: string;
  declare dustRunId: string;
  declare runStatus: string;
  declare promptTokens: number;
  declare completionTokens: number;

  declare userId: ForeignKey<XP1User["id"]>;
}

XP1Run.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dustUser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dustAppId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dustRunId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    runStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    promptTokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completionTokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    modelName: "run",
    sequelize: xp1_sequelize,
    indexes: [{ fields: ["userId"] }],
  }
);
XP1User.hasMany(XP1Run);
