"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../logger");
const db_1 = require("../../db");
exports.update = () => __awaiter(this, void 0, void 0, function* () {
    logger_1.i(`Inside ${__filename}, running update`);
    yield TBL_DASHBOARD();
    yield TBL_AUDIT_LOG();
    yield TBL_REGISTRATION();
    yield TBL_GROUP();
    yield TBL_USER();
    yield TBL_USER_AVATAR();
    yield TBL_LOOKUP_USER_GROUP();
    yield TBL_ROLE();
    yield TBL_LOOKUP_GROUP_ROLE();
    yield TBL_PRICING_STRUCTURE();
    yield TBL_LOOKUP_PRICING_STRUCTURE_GROUP();
    yield TBL_PRICING_STRUCTURE_ITEM();
    yield TBL_RULE();
    yield TBL_RULE_VALIDATE_CLAUSE();
    yield TBL_RULE_WHEN_CLAUSE();
    yield TBL_VIEW();
    yield TBL_ITEM();
    yield TBL_ITEM_IMAGE();
    yield TBL_ITEM_ATTRIBUTE();
    yield TBL_ITEM_ATTRIBUTE_METADATA();
    yield TBL_ITEM_ATTRIBUTE_METADATA_ENTRY();
    yield TBL_ITEM_VALUE();
    yield TBL_ITEM_VALUE_METADATA();
    yield TBL_ITEM_VALUE_METADATA_ENTRY();
    yield TBL_DATA_IMPORT();
    yield TBL_DATA_IMPORT_FILE();
    yield TBL_DATA_IMPORT_LOG();
    yield TBL_DATA_IMPORT_ITEM();
    yield TBL_DATA_IMPORT_ITEM_IMAGE();
    yield TBL_DATA_IMPORT_ITEM_ATTRIBUTE();
    yield TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA();
    yield TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA_ENTRY();
    yield TBL_DATA_IMPORT_ITEM_VALUE();
    yield TBL_DATA_IMPORT_ITEM_VALUE_METADATA();
    yield TBL_DATA_IMPORT_ITEM_VALUE_METADATA_ENTRY();
    yield TBL_DATA_EXPORT();
    yield TBL_DATA_EXPORT_FILE();
    yield TBL_DATA_EXPORT_LOG();
    yield TBL_DATA_EXPORT_ITEM();
    yield TBL_DATA_EXPORT_ITEM_IMAGE();
    yield TBL_DATA_EXPORT_ITEM_ATTRIBUTE();
    yield TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA();
    yield TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA_ENTRY();
    yield TBL_DATA_EXPORT_ITEM_VALUE();
    yield TBL_DATA_EXPORT_ITEM_VALUE_METADATA();
    yield TBL_DATA_EXPORT_ITEM_VALUE_METADATA_ENTRY();
    yield TBL_BULK_EDIT();
    yield TBL_BULK_EDIT_LOG();
    yield ADD_FK_CONSTRAINT();
    yield ADD_INDEXES();
    logger_1.i(`${__filename} done running update`);
});
const TBL_DASHBOARD = () => __awaiter(this, void 0, void 0, function* () {
    db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DASHBOARD (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            SERIALIZED_DATA TEXT 
         );
       `);
    });
});
const TBL_GROUP = () => __awaiter(this, void 0, void 0, function* () {
    // TBL_GROUP
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL 
         );
      `);
    });
});
const TBL_AUDIT_LOG = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_AUDIT_LOG (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            CATEGORY VARCHAR(200),
            CREATION_DATE TIMESTAMP,
            LOG TEXT 
         );
      `);
    });
});
const TBL_REGISTRATION = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_REGISTRATION (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USERNAME VARCHAR(200) NOT NULL,
            EMAIL VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP NOT NULL,
            TYPE VARCHAR(200) NOT NULL,                   # 'self' or 'invitation'
            CODE VARCHAR(200) NOT NULL,                   # 'invitation' use this to determine activation
            ACTIVATED BOOLEAN 
         );
      `);
    });
});
const TBL_USER = () => __awaiter(this, void 0, void 0, function* () {
    // TBL_USER
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USERNAME VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP NOT NULL,
            LAST_UPDATE TIMESTAMP NOT NULL,
            EMAIL VARCHAR(200) NOT NULL,
            ENABLED BOOLEAN
         );
      `);
    });
});
const TBL_USER_AVATAR = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER_AVATAR (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            MIME_TYPE VARCHAR(200),
            SIZE INT,
            CONTENT BLOB
         );
      `);
    });
});
const TBL_LOOKUP_USER_GROUP = () => __awaiter(this, void 0, void 0, function* () {
    // TBL_LOOKUP_USER_GROUP
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_USER_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT NOT NULL,
            GROUP_ID INT NOT NULL
         );
      `);
    });
});
const TBL_ROLE = () => __awaiter(this, void 0, void 0, function* () {
    // TBL_ROLE
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ROLE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `);
    });
});
const TBL_LOOKUP_GROUP_ROLE = () => __awaiter(this, void 0, void 0, function* () {
    // TBL_LOOKUP_GROUP_ROLE
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_GROUP_ROLE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            GROUP_ID INT NOT NULL,
            ROLE_ID INT NOT NULL
         );
      `);
    });
});
const TBL_PRICING_STRUCTURE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_PRICING_STRUCTURE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
          );  
      `);
    });
});
const TBL_LOOKUP_PRICING_STRUCTURE_GROUP = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_PRICING_STRUCTURE_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            PRICING_STRUCTURE_ID INT,
            GROUP_ID INT
         )
      `);
    });
});
const TBL_PRICING_STRUCTURE_ITEM = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_PRICING_STRUCTURE_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            PRICING_STRUCTURE_ID INT,
            PRICE DECIMAL
         );
      `);
    });
});
const TBL_RULE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `);
    });
});
const TBL_RULE_VALIDATE_CLAUSE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_VALIDATE_CLAUSE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_ID INT,
            ITEM_ATTRIBUTE_ID INT,
            OPERATOR VARCHAR(200),
            \`CONDITION\` VARCHAR(200)
         );
      `);
    });
});
const TBL_RULE_WHEN_CLAUSE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_WHEN_CLAUSE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_ID INT,
            ITEM_ATTRIBUTE_ID INT,
            OPERATOR VARCHAR(200),
            \`CONDITION\` VARCHAR(200) 
         );
      `);
    });
});
const TBL_VIEW = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `);
    });
});
const TBL_ITEM = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            PARENT_ID INT,
            VIEW_ID INT, 
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `);
    });
});
const TBL_ITEM_IMAGE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_IMAGE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            MIME_TYPE VARCHAR(200) NOT NULL,
            NAME VARCHAR(200) NOT NULL,
            SIZE INT NOT NULL,
            CONTENT BLOB NOT NULL 
         );
     `);
    });
});
const TBL_ITEM_ATTRIBUTE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_ATTRIBUTE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            ATTRIBUTE_METADATA_ID INT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `);
    });
});
const TBL_ITEM_ATTRIBUTE_METADATA = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_ATTRIBUTE_METADATA (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ATTRIBUTE_ID INT,
            NAME VARCHAR(200) NOT NULL 
         );
      `);
    });
});
const TBL_ITEM_ATTRIBUTE_METADATA_ENTRY = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ATTRIBUTE_METADATA_ID INT,
            \`KEY\` VARCHAR(200) NOT NULL,
            VALUE VARCHAR(500) NOT NULL 
         );
      `);
    });
});
const TBL_ITEM_VALUE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            ITEM_ATTRIBUTE_ID INT
         );
      `);
    });
});
const TBL_ITEM_VALUE_METADATA = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE_METADATA (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_VALUE_ID INT,
            NAME VARCHAR(200) NOT NULL 
         );
      `);
    });
});
const TBL_ITEM_VALUE_METADATA_ENTRY = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
            CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE_METADATA_ENTRY (
               ID INT PRIMARY KEY AUTO_INCREMENT,
               ITEM_VALUE_METADATA_ID INT,
               \`KEY\` VARCHAR(200) NOT NULL,
               VALUE VARCHAR(500) NOT NULL 
            );
         `);
    });
});
const TBL_DATA_IMPORT = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            CREATION_DATE TIMESTAMP
         );
      `);
    });
});
const TBL_DATA_IMPORT_FILE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_FILE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_IMPORT_ID INT,
            NAME VARCHAR(200),
            MIME_TYPE VARCHAR(200),
            SIZE INT,
            CONTENT BLOB 
         )
      `);
    });
});
const TBL_DATA_IMPORT_LOG = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_LOG (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_IMPORT_ID INT,
            CREATION_DATE TIMESTAMP,
            LEVEL VARCHAR(200),
            LOG TEXT 
         );
      `);
    });
});
const TBL_DATA_IMPORT_ITEM = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE TBL_DATA_IMPORT_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_IMPORT_ID INT,
            PARENT_ID INT,
            NAME VARCHAR(200),
            DESCRIPTION VARCHAR(500) 
         );
      `);
    });
});
const TBL_DATA_IMPORT_ITEM_IMAGE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_ITEM_IMAGE (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_IMPORT_ITEM_ID INT,
         MIME_TYPE VARCHAR(200) NOT NULL,
         NAME VARCHAR(200) NOT NULL,
         SIZE INT NOT NULL,
         CONTENT BLOB NOT NULL 
      );
  `);
    });
});
const TBL_DATA_IMPORT_ITEM_ATTRIBUTE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_ITEM_ATTRIBUTE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_IMPORT_ITEM_ID INT,
            ATTRIBUTE_METADATA_ID INT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `);
    });
});
const TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_IMPORT_ITEM_ATTRIBUTE_ID INT,
         NAME VARCHAR(200) NOT NULL 
      );
   `);
    });
});
const TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA_ENTRY = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA_ENTRY (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_IMPORT_ITEM_ATTRIBUTE_METADATA_ID INT,
         \`KEY\` VARCHAR(200) NOT NULL,
         VALUE VARCHAR(500) NOT NULL 
      );
   `);
    });
});
const TBL_DATA_IMPORT_ITEM_VALUE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_ITEM_VALUE (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_IMPORT_ITEM_ID INT,
         ITEM_ATTRIBUTE_ID INT
      );
   `);
    });
});
const TBL_DATA_IMPORT_ITEM_VALUE_METADATA = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_ITEM_VALUE_METADATA (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_IMPORT_ITEM_VALUE_ID INT,
         NAME VARCHAR(200) NOT NULL 
      );
   `);
    });
});
const TBL_DATA_IMPORT_ITEM_VALUE_METADATA_ENTRY = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_ITEM_VALUE_METADATA_ENTRY (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_IMPORT_ITEM_VALUE_METADATA_ID INT,
            \`KEY\` VARCHAR(200) NOT NULL,
            VALUE VARCHAR(500) NOT NULL 
         );
      `);
    });
});
const TBL_DATA_EXPORT = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         VIEW_ID INT,
         CREATION_DATE TIMESTAMP
      );
   `);
    });
});
const TBL_DATA_EXPORT_FILE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_FILE (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_EXPORT_ID INT,
         NAME VARCHAR(200),
         MIME_TYPE VARCHAR(200),
         SIZE INT,
         CONTENT BLOB 
      )
   `);
    });
});
const TBL_DATA_EXPORT_LOG = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_LOG (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_EXPORT_ID INT,
         CREATION_DATE TIMESTAMP,
         LEVEL VARCHAR(200),
         LOG TEXT 
      );
   `);
    });
});
const TBL_DATA_EXPORT_ITEM = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE TBL_DATA_EXPORT_ITEM (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_EXPORT_ID INT,
         PARENT_ID INT,
         NAME VARCHAR(200),
         DESCRIPTION VARCHAR(500) 
      );
   `);
    });
});
const TBL_DATA_EXPORT_ITEM_IMAGE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_ITEM_IMAGE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_EXPORT_ITEM_ID INT,
            MIME_TYPE VARCHAR(200) NOT NULL,
            NAME VARCHAR(200) NOT NULL,
            SIZE INT NOT NULL,
            CONTENT BLOB NOT NULL 
         );
   `);
    });
});
const TBL_DATA_EXPORT_ITEM_ATTRIBUTE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_ITEM_ATTRIBUTE (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_EXPORT_ITEM_ID INT,
         ATTRIBUTE_METADATA_ID INT,
         NAME VARCHAR(200) NOT NULL,
         DESCRIPTION VARCHAR(500) NOT NULL
      );
   `);
    });
});
const TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
   CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA (
      ID INT PRIMARY KEY AUTO_INCREMENT,
      DATA_EXPORT_ITEM_ATTRIBUTE_ID INT,
      NAME VARCHAR(200) NOT NULL 
   );
`);
    });
});
const TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA_ENTRY = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
   CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA_ENTRY (
      ID INT PRIMARY KEY AUTO_INCREMENT,
      DATA_EXPORT_ITEM_ATTRIBUTE_METADATA_ID INT,
      \`KEY\` VARCHAR(200) NOT NULL,
      VALUE VARCHAR(500) NOT NULL 
   );
`);
    });
});
const TBL_DATA_EXPORT_ITEM_VALUE = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
   CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_ITEM_VALUE (
      ID INT PRIMARY KEY AUTO_INCREMENT,
      DATA_EXPORT_ITEM_ID INT,
      ITEM_ATTRIBUTE_ID INT
   );
`);
    });
});
const TBL_DATA_EXPORT_ITEM_VALUE_METADATA = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
   CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_ITEM_VALUE_METADATA (
      ID INT PRIMARY KEY AUTO_INCREMENT,
      DATA_EXPORT_ITEM_VALUE_ID INT,
      NAME VARCHAR(200) NOT NULL 
   );
`);
    });
});
const TBL_DATA_EXPORT_ITEM_VALUE_METADATA_ENTRY = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
      CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_ITEM_VALUE_METADATA_ENTRY (
         ID INT PRIMARY KEY AUTO_INCREMENT,
         DATA_EXPORT_ITEM_VALUE_METADATA_ID INT,
         \`KEY\` VARCHAR(200) NOT NULL,
         VALUE VARCHAR(500) NOT NULL 
      );
   `);
    });
});
const TBL_BULK_EDIT = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_BULK_EDIT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200),
            DESCRIPTION VARCHAR(500)
         );
      `);
    });
});
const TBL_BULK_EDIT_LOG = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_BULK_EDIT_LOG (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            BULK_EDIT_ID INT,
            CREATION_DATE TIMESTAMP,
            LEVEL VARCHAR(200),
            LOG TEXT
         );
      `);
    });
});
const ADD_INDEXES = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        // todo: querios Indexes
    });
});
const ADD_FK_CONSTRAINT = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.doInDbConnection((conn) => {
        conn.query('ALTER TABLE TBL_DASHBOARD ADD CONSTRAINT FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID)');
        conn.query(` ALTER TABLE TBL_USER_AVATAR ADD CONSTRAINT FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID)`);
        conn.query(`ALTER TABLE TBL_LOOKUP_GROUP_ROLE ADD CONSTRAINT FOREIGN KEY (GROUP_ID) REFERENCES TBL_GROUP(ID)`);
        conn.query(`ALTER TABLE TBL_LOOKUP_GROUP_ROLE ADD CONSTRAINT FOREIGN KEY (ROLE_ID) REFERENCES TBL_ROLE(ID)`);
        conn.query(`ALTER TABLE TBL_LOOKUP_USER_GROUP ADD CONSTRAINT FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID)`);
        conn.query(`ALTER TABLE TBL_LOOKUP_USER_GROUP ADD CONSTRAINT FOREIGN KEY (GROUP_ID) REFERENCES  TBL_GROUP(ID)`);
        conn.query(`ALTER TABLE TBL_LOOKUP_PRICING_STRUCTURE_GROUP ADD CONSTRAINT FOREIGN KEY (PRICING_STRUCTURE_ID) REFERENCES TBL_PRICING_STRUCTURE(ID)`);
        conn.query(`ALTER TABLE TBL_LOOKUP_PRICING_STRUCTURE_GROUP ADD CONSTRAINT FOREIGN KEY (GROUP_ID) REFERENCES TBL_GROUP(ID)`);
        conn.query(`ALTER TABLE TBL_PRICING_STRUCTURE ADD CONSTRAINT FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
        conn.query(`ALTER TABLE TBL_PRICING_STRUCTURE_ITEM ADD CONSTRAINT FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_PRICING_STRUCTURE_ITEM ADD CONSTRAINT FOREIGN KEY (PRICING_STRUCTURE_ID) REFERENCES TBL_PRICING_STRUCTURE(ID)`);
        conn.query(`ALTER TABLE TBL_RULE ADD CONSTRAINT FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
        conn.query(`ALTER TABLE TBL_RULE_VALIDATE_CLAUSE ADD CONSTRAINT FOREIGN KEY (RULE_ID) REFERENCES TBL_RULE(ID)`);
        conn.query(`ALTER TABLE TBL_RULE_VALIDATE_CLAUSE ADD CONSTRAINT FOREIGN KEY (ITEM_ATTRIBUTE_ID) REFERENCES TBL_ITEM_ATTRIBUTE(ID)`);
        conn.query(`ALTER TABLE TBL_RULE_WHEN_CLAUSE ADD CONSTRAINT FOREIGN KEY (RULE_ID) REFERENCES TBL_RULE(ID)`);
        conn.query(`ALTER TABLE TBL_RULE_WHEN_CLAUSE ADD CONSTRAINT FOREIGN KEY (ITEM_ATTRIBUTE_ID) REFERENCES TBL_ITEM_ATTRIBUTE(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM ADD CONSTRAINT FOREIGN KEY (PARENT_ID) REFERENCES TBL_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM ADD CONSTRAINT FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_IMAGE ADD CONSTRAINT FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_ATTRIBUTE ADD CONSTRAINT FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_ATTRIBUTE ADD CONSTRAINT FOREIGN KEY (ATTRIBUTE_METADATA_ID) REFERENCES TBL_ITEM_ATTRIBUTE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_ATTRIBUTE_METADATA ADD CONSTRAINT FOREIGN KEY (ITEM_ATTRIBUTE_ID) REFERENCES TBL_ITEM_ATTRIBUTE(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_ATTRIBUTE_METADATA_ENTRY ADD CONSTRAINT FOREIGN KEY (ITEM_ATTRIBUTE_METADATA_ID) REFERENCES TBL_ITEM_ATTRIBUTE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_VALUE ADD CONSTRAINT FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_VALUE ADD CONSTRAINT FOREIGN KEY (ITEM_ATTRIBUTE_ID) REFERENCES TBL_ITEM_ATTRIBUTE(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_VALUE_METADATA ADD CONSTRAINT FOREIGN KEY (ITEM_VALUE_ID) REFERENCES TBL_ITEM_VALUE(ID)`);
        conn.query(`ALTER TABLE TBL_ITEM_VALUE_METADATA_ENTRY ADD CONSTRAINT FOREIGN KEY (ITEM_VALUE_METADATA_ID) REFERENCES TBL_ITEM_VALUE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT ADD CONSTRAINT FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_FILE ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ID) REFERENCES TBL_DATA_IMPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_LOG ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ID) REFERENCES TBL_DATA_IMPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ID) REFERENCES TBL_DATA_IMPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM ADD CONSTRAINT FOREIGN KEY (PARENT_ID) REFERENCES TBL_DATA_IMPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_IMAGE ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ITEM_ID) REFERENCES TBL_DATA_IMPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_LOG ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ID) REFERENCES TBL_DATA_IMPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ID) REFERENCES TBL_DATA_IMPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM ADD CONSTRAINT FOREIGN KEY (PARENT_ID) REFERENCES TBL_DATA_IMPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_IMAGE ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ITEM_ID) REFERENCES TBL_DATA_IMPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_ATTRIBUTE ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ITEM_ID) REFERENCES TBL_DATA_IMPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_ATTRIBUTE ADD CONSTRAINT FOREIGN KEY (ATTRIBUTE_METADATA_ID) REFERENCES TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ITEM_ATTRIBUTE_ID) REFERENCES TBL_DATA_IMPORT_ITEM_ATTRIBUTE(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA_ENTRY ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ITEM_ATTRIBUTE_METADATA_ID) REFERENCES TBL_DATA_IMPORT_ITEM_ATTRIBUTE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_VALUE ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ITEM_ID) REFERENCES TBL_DATA_IMPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_VALUE ADD CONSTRAINT FOREIGN KEY (ITEM_ATTRIBUTE_ID) REFERENCES TBL_DATA_IMPORT_ITEM_ATTRIBUTE(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_VALUE_METADATA ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ITEM_VALUE_ID) REFERENCES TBL_DATA_IMPORT_ITEM_VALUE(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_IMPORT_ITEM_VALUE_METADATA_ENTRY ADD CONSTRAINT FOREIGN KEY (DATA_IMPORT_ITEM_VALUE_METADATA_ID) REFERENCES TBL_DATA_IMPORT_ITEM_VALUE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT ADD CONSTRAINT FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_FILE ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ID) REFERENCES TBL_DATA_EXPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_LOG ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ID) REFERENCES TBL_DATA_EXPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ID) REFERENCES TBL_DATA_EXPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM ADD CONSTRAINT FOREIGN KEY (PARENT_ID) REFERENCES TBL_DATA_EXPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_IMAGE ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ITEM_ID) REFERENCES TBL_DATA_EXPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_LOG ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ID) REFERENCES TBL_DATA_EXPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ID) REFERENCES TBL_DATA_EXPORT(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM ADD CONSTRAINT FOREIGN KEY (PARENT_ID) REFERENCES TBL_DATA_EXPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_IMAGE ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ITEM_ID) REFERENCES TBL_DATA_EXPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_ATTRIBUTE ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ITEM_ID) REFERENCES TBL_DATA_EXPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_ATTRIBUTE ADD CONSTRAINT FOREIGN KEY (ATTRIBUTE_METADATA_ID) REFERENCES TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ITEM_ATTRIBUTE_ID) REFERENCES TBL_DATA_EXPORT_ITEM_ATTRIBUTE(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA_ENTRY ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ITEM_ATTRIBUTE_METADATA_ID) REFERENCES TBL_DATA_EXPORT_ITEM_ATTRIBUTE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_VALUE ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ITEM_ID) REFERENCES TBL_DATA_EXPORT_ITEM(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_VALUE ADD CONSTRAINT FOREIGN KEY (ITEM_ATTRIBUTE_ID) REFERENCES TBL_DATA_EXPORT_ITEM_ATTRIBUTE(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_VALUE_METADATA ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ITEM_VALUE_ID) REFERENCES TBL_DATA_EXPORT_ITEM_VALUE(ID)`);
        conn.query(`ALTER TABLE TBL_DATA_EXPORT_ITEM_VALUE_METADATA_ENTRY ADD CONSTRAINT FOREIGN KEY (DATA_EXPORT_ITEM_VALUE_METADATA_ID) REFERENCES TBL_DATA_EXPORT_ITEM_VALUE_METADATA(ID)`);
        conn.query(`ALTER TABLE TBL_BULK_EDIT_LOG ADD CONSTRAINT FOREIGN KEY (BULK_EDIT_ID) REFERENCES TBL_BULK_EDIT(ID)`);
    });
});
