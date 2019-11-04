import {Pool, PoolConnection} from "mariadb";
import {i} from '../../logger';
import {doInDbConnection} from "../../db";


export const update = () => {
   i(`Inside ${__filename}, running update`);

   TBL_GROUP();
   TBL_USER();
   TBL_LOOKUP_USER_GROUP();
   TBL_ROLE();
   TBL_LOOKUP_GROUP_ROLE();
   TBL_PRICING_STRUCTURE();

   i(`${__filename} done running update`);
};

const TBL_GROUP = () => {
   // TBL_GROUP
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL 
         );
      `);
   });
};

const TBL_USER = () => {
   // TBL_USER
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL, 
         );
      `)
   });
};

const TBL_LOOKUP_USER_GROUP = () => {
   // TBL_LOOKUP_USER_GROUP
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_USER_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT NOT NULL,
            GROUP_ID INT NOT NULL,
            CONSTRAINT FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID),
            CONSTRAINT FOREIGN KEY (GROUP_ID) REFERENCES TBL_GROUP(ID)
         );
      `);
   });
};

const TBL_ROLE = () => {
   // TBL_ROLE
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ROLE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `);
   });
};

const TBL_LOOKUP_GROUP_ROLE = () => {
   // TBL_LOOKUP_GROUP_ROLE
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_GROUP_ROLE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            GROUP_ID INT NOT NULL,
            ROLE_ID INT NOT NULL,
            CONSTRAINT FOREIGN KEY (GROUP_ID) REFERENCES GROUP(ID),
            CONSTRAINT FOREIGN KEY (ROLE_ID) REFERENCES ROLE(ID)
         );
      `);
   });

};

const TBL_PRICING_STRUCTURE = () => {
    doInDbConnection((conn: PoolConnection) => {
        conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_PRICING_STRUCTURE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
            VIEW_ID INT
          );  
        `);
    });

const TBL_LOOKUP_PRICING_STRUCTURE_GROUP = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_PRICING_STRUCTURE_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            PRICING_STRUCTURE_ID INT,
            GROUP_ID INT
         )
      `)
   });
}

const TBL_PRICING_STRUCTURE_ITEM = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_PRICING_STRUCTURE_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            PRICING_STRUCTURE_ID INT,
            PRICE NUMBER
         );
      `);
   });
}

const TBL_RULE = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXIST TBL_RULE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
         );
      `)
   });
}

const TBL_RULE_VALIDATE_CLAUSE = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_VALIDATE_CLAUSE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_ID INT,
            ATTRIBUTE_ID INT,
            OPERATOR VARCHAR(200),
            CONDITION VARCHAR(200)
         );
      `);
   })
};

const TBL_RULE_WHEN_CLAUSE = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_WHEN_CLAUSE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            RULE_ID INT,
            ATTRIBUTE_ID INT,
            OPERATOR VARCHAR(200),
            CONDITION VARCHAR(200) 
         );
      `);
   });
};

const TBL_VIEW = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `)
   });
};

const TBL_ITEM = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            PARENT_ID INT,
            VIEW_ID INT, 
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL
         );
      `)
   })
};

const TBL_ITEM_IMAGE = () => {
  doInDbConnection((conn: PoolConnection) => {
     conn.query(`
         CREATE TABLE IF NOT EXIST TBL_ITEM_IMAGE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            MIME_TYPE VARCHAR(200) NOT NULL,
            NAME VARCHAR(200) NOT NULL,
            SIZE NUMBER NOT NULL,
            CONTENT BLOB NOT NULL 
         );
     `)
  })
};

const TBL_ITEM_ATTRIBUTE = () => {
   doInDbConnection((conn: PoolConnection) => {
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
};

const TBL_ITEM_ATTRIBUTE_METADATA = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_ATTRIBUTE_METADATA (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ATTRIBUTE_ID INT,
            NAME VARCHAR(200) NOT NULL 
         );
      `);
   });
};

const TBL_ITEM_ATTRIBUTE_METADATA_ENTRY = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ATTRIBUTE_METADATA_ID INT,
            KEY VARCHAR(200) NOT NULL,
            VALUE VARCHAR(500) NOT NULL 
         );
      `);
   }) ;
};

const TBL_ITEM_VALUE = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            ATTRIBUTE_ID INT
         );
      `);
   });
};

const TBL_ITEM_VALUE_METADATA = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE_METADATA (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_VALUE_ID INT,
            NAME VARCHAR(200) NOT NULL 
         );
      `);
   });
};


const TBL_ITEM_VALUE_METADATA_ENTRY = () => {
    doInDbConnection((conn: PoolConnection) => {
         conn.query(`
            CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE_METADATA_ENTRY (
               ID INT PRIMARY KEY AUTO_INCREMENT,
               ITEM_METADATA_ID INT,
               KEY VARCHAR(200) NOT NULL,
               VALUE VARCHAR(500) NOT NULL 
            );
         `);
    });
};


const TBL_DATA_IMPORT = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            CREATION_DATE DATE,
         );
      `);
   });
};

const TBL_DATA_IMPORT_FILE = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_FILE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_IMPORT_ID INT,
            NAME VARHAR(200),
            MIME_TYPE VARCHAR(200),
            SIZE NUMBER,
            CONTENT BLOB 
         )
      `);
   });
}

const TBL_DATA_IMPORT_LOG = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_LOG (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            CREATION_DATE DATE,
            LEVEL VARCHAR(200),
            LOG TEXT 
         );
      `);
   });
};

const TBL_DATA_IMPORT_ITEM = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(``);
   });
};

const TBL_DATA_IMPORT_ITEM_ATTRIBUTE = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(``);
   });
};


const TBL_DATA_EXPORT = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(``);
   });
};

const TBL_DATA_EXPORT_FILE = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(``);
   });
};


const TBL_DATA_EXPORT_LOG = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(``);
   });
};
const TBL_DATA_EXPORT_ITEM = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(``);
   });
};

const TBL_DATA_EXPORT_ITEM_ATTRIBUTE = () => {
   doInDbConnection((conn: PoolConnection) => {
      conn.query(``);
   });
};



   const TBL_RULE_WHERE_CLAUSE = () => {

}

    // ALTER TABLE TBL_GROUP ADD CONSTRAINT FOREIGN KEY (PRICING_STRUCTURE_ID) REFERENCES TBL_PRICING_STRUCTURE(ID)
};



