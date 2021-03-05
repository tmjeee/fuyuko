import {Connection} from "mariadb";
import {i} from '../../logger';
import {doInDbConnection} from "../../db";
import {UPDATER_PROFILE_CORE} from "../updater";

export const profiles = [UPDATER_PROFILE_CORE];

export const update = async () => {

   i(`running scripts in ${__filename}`);

   await TBL_INVITATION_REGISTRATION();
   await TBL_INVITATION_REGISTRATION_GROUPS();
   await TBL_SELF_REGISTRATION();
   await TBL_USER_THEME();
   await TBL_USER_DASHBOARD();
   await TBL_USER_DASHBOARD_WIDGET();
   await TBL_AUDIT_LOG();
   await TBL_GROUP();
   await TBL_USER();
   await TBL_GLOBAL_AVATAR();
   await TBL_GLOBAL_IMAGE();
   await TBL_USER_AVATAR();
   await TBL_LOOKUP_USER_GROUP();
   await TBL_ROLE();
   await TBL_LOOKUP_GROUP_ROLE();
   await TBL_PRICING_STRUCTURE();
   await TBL_LOOKUP_PRICING_STRUCTURE_GROUP();
   await TBL_PRICING_STRUCTURE_ITEM();
   await TBL_CUSTOM_RULE();
   await TBL_CUSTOM_RULE_VIEW();
   await TBL_RULE();
   await TBL_RULE_VALIDATE_CLAUSE();
   await TBL_RULE_VALIDATE_CLAUSE_METADATA();
   await TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY();
   await TBL_RULE_WHEN_CLAUSE();
   await TBL_RULE_WHEN_CLAUSE_METADATA();
   await TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY();
   await TBL_VIEW();
   await TBL_ITEM();
   await TBL_ITEM_IMAGE();
   await TBL_VIEW_ATTRIBUTE();
   await TBL_VIEW_ATTRIBUTE_METADATA();
   await TBL_VIEW_ATTRIBUTE_METADATA_ENTRY();
   await TBL_ITEM_VALUE();
   await TBL_ITEM_VALUE_METADATA();
   await TBL_ITEM_VALUE_METADATA_ENTRY();
   await TBL_DATA_IMPORT();
   await TBL_DATA_IMPORT_FILE();
   await TBL_DATA_EXPORT();
   await TBL_DATA_EXPORT_FILE();
   await TBL_JOB();
   await TBL_JOB_LOG();
   await TBL_VIEW_VALIDATION();
   await TBL_VIEW_VALIDATION_LOG();
   await TBL_VIEW_VALIDATION_ERROR();
   await TBL_USER_SETTING();
   await TBL_USER_NOTIFICATION();
   await TBL_CUSTOM_DATA_IMPORT();
   await TBL_CUSTOM_DATA_EXPORT();
   await TBL_CUSTOM_BULK_EDIT();
   await TBL_VIEW_CATEGORY();
   await TBL_LOOKUP_VIEW_CATEGORY_ITEM();
   await TBL_FORGOT_PASSWORD();
   await TBL_FAVOURITE_ITEM();
   await TBL_WORKFLOW_DEFINITION();
   await TBL_WORKFLOW();
   await TBL_WORKFLOW_ATTRIBUTE();
   await TBL_WORKFLOW_INSTANCE();
   await TBL_WORKFLOW_INSTANCE_COMMENT();
   await TBL_WORKFLOW_INSTANCE_LOG();
   await TBL_WORKFLOW_INSTANCE_TASK();

   await ADD_FK_CONSTRAINT();
   await ADD_INDEXES();

   i(`done running update on ${__filename}`);
};

const TBL_WORKFLOW_DEFINITION = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_WORKFLOW_DEFINITION`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_WORKFLOW_DEFINITION (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200),
            DESCRIPTION VARCHAR(500),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_WORKFLOW = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_WORKFLOW`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_WORKFLOW (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            VIEW_ID INT,
            WORKFLOW_DEFINITION_ID INT,
            TYPE VARCHAR(200),      /* Attribute, Item, Price, Rule, User, Category, AttributeValue */
            ACTION VARCHAR(200),    /* Create, Edit, Delete */
            STATUS VARCHAR(200),    /* ENABLED, DISABLED, DELETED */
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_WORKFLOW_ATTRIBUTE = async () => {
   await doInDbConnection(async (conn) => {
      i(`update TBL_WORKFLOW_ATTRIBUTE`);
      await conn.query(`
         CREATE TABLE TBL_WORKFLOW_ATTRIBUTE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            WORKFLOW_ID INT NOT NULL,
            ATTRIBUTE_ID INT NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_WORKFLOW_INSTANCE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_WORKFLOW_INSTANCE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_WORKFLOW_INSTANCE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(500) NOT NULL,
            WORKFLOW_ID INT,
            FUNCTION_INPUTS TEXT,
            CURRENT_WORKFLOW_STATE VARCHAR(200),
            OLD_VALUE TEXT,                           /* old changed value (in json format) */
            NEW_VALUE TEXT,                           /* new changed value (in json format) */
            DATA TEXT,                                /* engine in serialized form */
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_WORKFLOW_INSTANCE_COMMENT = async () => {
   await doInDbConnection(async conn => {
      i(`update TBL_WORKFLOW_INSTANCE_COMMENT`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_WORKFLOW_INSTANCE_COMMENT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            WORKFLOW_INSTANCE_ID INT NOT NULL, 
            COMMENT TEXT,
            USER_ID INT NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         ); 
      `);
   });
};

const TBL_WORKFLOW_INSTANCE_TASK = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_WORKFLOW_INSTANCE_TASK`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_WORKFLOW_INSTANCE_TASK (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(500) NOT NULL,
            WORKFLOW_INSTANCE_ID INT,
            TASK_TITLE VARCHAR(500),
            TASK_DESCRIPTION TEXT,
            POSSIBLE_APPROVAL_STAGES VARCHAR(200),    /* possible approval stages eg. (approve, reject etc) in json array format */
            TASK_OLD_VALUE TEXT,                      /* not used */
            TASK_NEW_VALUE TEXT,                      /* not used */
            WORKFLOW_STATE VARCHAR(500),              /* workflow instance state for this task */
            APPROVAL_STAGE VARCHAR(500),              /* action done on this task, eg. approve, reject etc. (NULL if not yet done)  */
            APPROVER_USER_ID INT,                     /* the user who needs to action on this */
            STATUS VARCHAR(500),                      /* PENDING, ACTIONED, EXPIRED */
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         ); 
      `);
   });
};

const TBL_WORKFLOW_INSTANCE_LOG = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_WORKFLOW_INSTANCE_LOG`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_WORKFLOW_INSTANCE_LOG (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            WORKFLOW_INSTANCE_ID INT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            LOG TEXT 
         );
      `);
   });
};


const TBL_FAVOURITE_ITEM = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_FAVOURITE_ITEM`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_FAVOURITE_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            ITEM_ID INT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};


const TBL_FORGOT_PASSWORD = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_FORGOT_PASSWORD`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_FORGOT_PASSWORD (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            CODE VARCHAR(500),
            STATUS VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
         );
      `)
   });
};

const TBL_VIEW_CATEGORY = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_VIEW_CATEGORY`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW_CATEGORY (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500),
            STATUS VARCHAR(200),
            VIEW_ID INT,
            PARENT_ID INT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
         );
      `);
   });
};

const TBL_LOOKUP_VIEW_CATEGORY_ITEM = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_VIEW_CATEGORY_ITEM`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_VIEW_CATEGORY_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_CATEGORY_ID INT NOT NULL,
            ITEM_ID INT NOT NULL 
         );
      `);
   });
};

const TBL_CUSTOM_DATA_EXPORT = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_CUSTOM_DATA_EXPORT`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_CUSTOM_DATA_EXPORT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
         );
      `);
   });
};

const TBL_CUSTOM_BULK_EDIT = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_CUSTOM_BULK_EDIT`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_CUSTOM_BULK_EDIT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
         );
      `);
   });
};

const TBL_CUSTOM_DATA_IMPORT = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_CUSTOM_DATA_IMPORT`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_CUSTOM_DATA_IMPORT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_USER_NOTIFICATION = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_USER_NOTIFICATION`);
     await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER_NOTIFICATION (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            IS_NEW BOOLEAN,
            STATUS VARCHAR(200),
            TITLE VARCHAR(200),
            MESSAGE TEXT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
     `);
   });
};

const TBL_USER_SETTING = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_USER_SETTING`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER_SETTING (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            SETTING VARCHAR(200),
            VALUE VARCHAR(500),
            TYPE VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_VIEW_VALIDATION = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_VIEW_VALIDATION`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW_VALIDATION (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            NAME VARCHAR(200),
            DESCRIPTION VARCHAR(500),
            PROGRESS VARCHAR(200),
            TOTAL_ITEMS INT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
}

const TBL_VIEW_VALIDATION_LOG = async () => {
    await doInDbConnection(async (conn: Connection) => {
       i(`update TBL_VIEW_VALIDATION_LOG`);
       await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW_VALIDATION_LOG (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_VALIDATION_ID INT,
            \`LEVEL\` VARCHAR(200),
            MESSAGE TEXT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP         
         );
       `);
    });
}

const TBL_VIEW_VALIDATION_ERROR = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_VIEW_VALIDATION_ERROR`);
      await conn.query(`
           CREATE TABLE IF NOT EXISTS TBL_VIEW_VALIDATION_ERROR (
              ID INT PRIMARY KEY AUTO_INCREMENT,
              VIEW_VALIDATION_ID INT,
              RULE_ID INT,
              CUSTOM_RULE_ID INT,
              ITEM_ID INT,
              VIEW_ATTRIBUTE_ID INT,
              MESSAGE TEXT,
              \`LEVEL\` VARCHAR(200) NOT NULL,
              CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
           ); 
       `);
   });
}

const TBL_INVITATION_REGISTRATION = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_INVITATION_REGISTRATION`);
       await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_INVITATION_REGISTRATION (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            EMAIL VARCHAR(200) NOT NULL,
            CODE VARCHAR(200) NOT NULL,
            ACTIVATED BOOLEAN NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
       `);
   });
}

const TBL_INVITATION_REGISTRATION_GROUPS = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_INVITATION_REGISTRATION_GROUP`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_INVITATION_REGISTRATION_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            INVITATION_REGISTRATION_ID INT,
            GROUP_ID INT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};


const TBL_SELF_REGISTRATION = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_SELF_REGISTRATION`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_SELF_REGISTRATION (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USERNAME VARCHAR(200) NOT NULL,
            EMAIL VARCHAR(200) NOT NULL,
            FIRSTNAME VARCHAR(200) NOT NULL,
            LASTNAME VARCHAR(200) NOT NULL,
            PASSWORD VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            ACTIVATED BOOLEAN NOT NULL
         );
      `);
   });
}


const TBL_GROUP = async () => {
   // TBL_GROUP
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_GROUP`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
            STATUS VARCHAR(200) NOT NULL,
            IS_SYSTEM BOOLEAN NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_AUDIT_LOG = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_AUDIT_LOG`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_AUDIT_LOG (
            ID BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            CATEGORY VARCHAR(200) NOT NULL,
            \`LEVEL\` VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            REQUEST_UUID VARCHAR(200),
            USER_ID INT,
            LOG LONGTEXT
         );
      `);
   })
}


const TBL_USER = async () => {
   // TBL_USER
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_USER`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USERNAME VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            EMAIL VARCHAR(200) NOT NULL,
            FIRSTNAME VARCHAR(200) NOT NULL,
            LASTNAME VARCHAR(200) NOT NULL,
            STATUS VARCHAR(200) NOT NULL,
            PASSWORD VARCHAR(500) NOT NULL
         );
      `)
   });
};

const TBL_USER_THEME = async () => {
    await doInDbConnection(async (conn: Connection) => {
       i(`update TBL_USER_THEME`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER_THEME (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            THEME VARCHAR(200) NOT NULL ,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
    });
};


const TBL_USER_DASHBOARD = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_USER_DASHBOARD`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER_DASHBOARD (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            SERIALIZED_DATA TEXT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );      
      `);
   });
};

const TBL_USER_DASHBOARD_WIDGET = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_USER_DASHBOARD_WIDGET`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER_DASHBOARD_WIDGET (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_DASHBOARD_ID INT,
            WIDGET_INSTANCE_ID VARCHAR(200),
            WIDGET_TYPE_ID VARCHAR(200),
            SERIALIZED_DATA TEXT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_GLOBAL_IMAGE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`TBL_GLOBAL_IMAGE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_GLOBAL_IMAGE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            TAG VARCHAR(200) NOT NULL,
            NAME VARCHAR(200) NOT NULL,
            MIME_TYPE VARCHAR(200) NOT NULL,
            SIZE INT NOT NULL,
            CONTENT LONGBLOB NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         )
      `);
   });
}

const TBL_GLOBAL_AVATAR = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_GLOBAL_AVATAR`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_GLOBAL_AVATAR (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            MIME_TYPE VARCHAR(200) NOT NULL,
            SIZE INT NOT NULL,
            CONTENT LONGBLOB NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
}

const TBL_USER_AVATAR = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`TBL_USER_AVATAR`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_USER_AVATAR (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT,
            GLOBAL_AVATAR_ID INT,
            NAME VARCHAR(200),
            MIME_TYPE VARCHAR(200),
            SIZE INT,
            CONTENT LONGBLOB,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_LOOKUP_USER_GROUP = async () => {
   // TBL_LOOKUP_USER_GROUP
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_LOOKUP_USER_GROUP`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_USER_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            USER_ID INT NOT NULL,
            GROUP_ID INT NOT NULL
         );
      `);
   });
};

const TBL_ROLE = async () => {
   // TBL_ROLE
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_ROLE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ROLE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_LOOKUP_GROUP_ROLE = async () => {
   // TBL_LOOKUP_GROUP_ROLE
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_LOOKUP_GROUP_ROLE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_GROUP_ROLE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            GROUP_ID INT NOT NULL,
            ROLE_ID INT NOT NULL
         );
      `);
   });

};

const TBL_PRICING_STRUCTURE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_PRICING_STRUCTURE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_PRICING_STRUCTURE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
            STATUS VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          );  
      `);
   });
}


const TBL_LOOKUP_PRICING_STRUCTURE_GROUP = async () => {
   i(`update TBL_PRICING_STRUCTURE_GROUP`);
   await doInDbConnection(async (conn: Connection) => {
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_LOOKUP_PRICING_STRUCTURE_GROUP (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            PRICING_STRUCTURE_ID INT,
            GROUP_ID INT
         )
      `)
   });
}


const TBL_PRICING_STRUCTURE_ITEM = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_PRICING_STRUCTURE_ITEM`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_PRICING_STRUCTURE_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            PRICING_STRUCTURE_ID INT,
            COUNTRY VARCHAR(200),
            PRICE DECIMAL(60, 2),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
}

const TBL_CUSTOM_RULE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_CUSTOM_RULE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_CUSTOM_RULE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
}

const TBL_CUSTOM_RULE_VIEW = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_CUSTOM_RULE_VIEW`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_CUSTOM_RULE_VIEW (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            CUSTOM_RULE_ID INT,
            STATUS VARCHAR(200),
            VIEW_ID INT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
}

const TBL_RULE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_RULE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
            STATUS VARCHAR(200) NOT NULL,
            \`LEVEL\` VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `)
   });
}

const TBL_RULE_VALIDATE_CLAUSE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_RULE_VALIDATE_CLAUSE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_VALIDATE_CLAUSE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_ID INT,
            VIEW_ATTRIBUTE_ID INT,
            OPERATOR VARCHAR(200),
            \`CONDITION\` VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   })
};

const TBL_RULE_VALIDATE_CLAUSE_METADATA = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_RULE_VALIDATE_CLAUSE_METADATA`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_VALIDATE_CLAUSE_METADATA (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_VALIDATE_CLAUSE_ID INT,
            NAME VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
}

const TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_VALIDATE_CLAUSE_METADATA_ID INT,
            \`KEY\` VARCHAR(200),
            \`VALUE\` VARCHAR(500),
            DATA_TYPE VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
}

const TBL_RULE_WHEN_CLAUSE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_RULE_WHEN_CLAUSE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_WHEN_CLAUSE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_ID INT,
            VIEW_ATTRIBUTE_ID INT,
            OPERATOR VARCHAR(200),
            \`CONDITION\` VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_RULE_WHEN_CLAUSE_METADATA = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_RULE_WHEN_CLAUSE_METADATA`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_WHEN_CLAUSE_METADATA (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_WHEN_CLAUSE_ID INT,
            NAME VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            RULE_WHEN_CLAUSE_METADATA_ID INT,
            \`KEY\` VARCHAR(200),
            \`VALUE\` VARCHAR(500),
            DATA_TYPE VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   })
};

const TBL_VIEW = async () => {
   await doInDbConnection(async (conn: Connection) => {
       i(`update TBL_VIEW`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
            STATUS VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `)
   });
};

const TBL_ITEM = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_ITEM`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            PARENT_ID INT,
            VIEW_ID INT, 
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
            STATUS VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `)
   })
};

const TBL_ITEM_IMAGE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_ITEM_IMAGE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_IMAGE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            \`PRIMARY\` BOOLEAN,
            MIME_TYPE VARCHAR(200) NOT NULL,
            NAME VARCHAR(200) NOT NULL,
            SIZE INT NOT NULL,
            CONTENT LONGBLOB NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
     `)
   })
};

const TBL_VIEW_ATTRIBUTE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_VIEW_ATTRIBUTE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW_ATTRIBUTE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT NOT NULL,
            TYPE VARCHAR(200) NOT NULL,
            NAME VARCHAR(200) NOT NULL,
            STATUS VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_VIEW_ATTRIBUTE_METADATA = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_VIEW_ATTRIBUTE_METADATA`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW_ATTRIBUTE_METADATA (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ATTRIBUTE_ID INT,
            NAME VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_VIEW_ATTRIBUTE_METADATA_ENTRY = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_VIEW_ATTRIBUTE_METADATA_ENTRY`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ATTRIBUTE_METADATA_ID INT,
            \`KEY\` VARCHAR(200) NOT NULL,
            VALUE VARCHAR(500) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_ITEM_VALUE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_ITEM_VALUE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_ID INT,
            VIEW_ATTRIBUTE_ID INT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_ITEM_VALUE_METADATA = async () => {
   await doInDbConnection(async(conn: Connection) => {
      i(`update TBL_ITEM_VALUE_METADATA`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE_METADATA (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_VALUE_ID INT,
            NAME VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};


const TBL_ITEM_VALUE_METADATA_ENTRY = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_ITEM_VALUE_METADATA_ENTRY`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_ITEM_VALUE_METADATA_ENTRY (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            ITEM_VALUE_METADATA_ID INT,
            \`KEY\` VARCHAR(200) NOT NULL,
            \`VALUE\` VARCHAR(500) NOT NULL,
            DATA_TYPE VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};


const TBL_DATA_IMPORT = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_DATA_IMPORT`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT NOT NULL,
            NAME VARCHAR(200) NOT NULL,
            TYPE VARCHAR(200) NOT NULL,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_DATA_IMPORT_FILE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_DATA_IMPORT_FILE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_IMPORT_FILE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_IMPORT_ID INT,
            NAME VARCHAR(200) NOT NULL,
            MIME_TYPE VARCHAR(200) NOT NULL,
            SIZE INT NOT NULL,
            CONTENT LONGBLOB NOT NULL, 
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         )
      `);
   });
}


const TBL_DATA_EXPORT = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_DATA_EXPORT`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            VIEW_ID INT,
            NAME VARCHAR(200),
            TYPE VARCHAR(200),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         );
      `);
   });
};

const TBL_DATA_EXPORT_FILE = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_DATA_EXPORT_FILE`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_DATA_EXPORT_FILE (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            DATA_EXPORT_ID INT,
            NAME VARCHAR(200),
            MIME_TYPE VARCHAR(200),
            SIZE INT,
            CONTENT LONGBLOB,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         )
      `);
   });
}

const TBL_JOB = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update TBL_JOB`);
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_JOB (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            NAME VARCHAR(200) NOT NULL,
            DESCRIPTION VARCHAR(500),
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            STATUS VARCHAR(200),
            PROGRESS VARCHAR(200)
         );
      `);
   });
};

const TBL_JOB_LOG = async () => {
   i(`update TBL_JOB_LOG`);
   await doInDbConnection(async (conn: Connection) => {
      await conn.query(`
         CREATE TABLE IF NOT EXISTS TBL_JOB_LOG (
            ID INT PRIMARY KEY AUTO_INCREMENT,
            JOB_ID INT,
            CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            LAST_UPDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            \`LEVEL\` VARCHAR(200) NOT NULL,
            LOG LONGTEXT NOT NULL
         );
      `);
   });
};

const ADD_INDEXES = async () => {
   await doInDbConnection(async (conn: Connection) => {
       // todo: queries Indexes
   });
};

const ADD_FK_CONSTRAINT = async () => {
   await doInDbConnection(async (conn: Connection) => {
      i(`update indexes`);

      await conn.query(`ALTER TABLE TBL_INVITATION_REGISTRATION_GROUP ADD CONSTRAINT \`fk_tbl_invitation_registration_group-1\` FOREIGN KEY (INVITATION_REGISTRATION_ID) REFERENCES TBL_INVITATION_REGISTRATION(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_INVITATION_REGISTRATION_GROUP ADD CONSTRAINT \`fk_tbl_invitation_registration_group-2\` FOREIGN KEY (GROUP_ID) REFERENCES TBL_GROUP(ID)`);

      await conn.query(`ALTER TABLE TBL_USER_AVATAR ADD CONSTRAINT \`fk_tbl_user_avatar-1\` FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID)`);
      await conn.query('ALTER TABLE TBL_USER_AVATAR ADD CONSTRAINT \`fk_tbl_user_avatar-2\` FOREIGN KEY (GLOBAL_AVATAR_ID) REFERENCES TBL_GLOBAL_AVATAR(ID)');

      await conn.query(`ALTER TABLE TBL_USER_THEME ADD CONSTRAINT \`fk_tbl_user_theme-1\` FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID)`);

      await conn.query(`ALTER TABLE TBL_USER_DASHBOARD ADD CONSTRAINT \`fk_tbl_user_dashboard-1\` FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID)`);

      await conn.query(`ALTER TABLE TBL_USER_DASHBOARD_WIDGET ADD CONSTRAINT \`fk_tbl_user_dashboard_widget-1\` FOREIGN KEY (USER_DASHBOARD_ID) REFERENCES TBL_USER_DASHBOARD(ID)`);

      await conn.query(`ALTER TABLE TBL_LOOKUP_GROUP_ROLE ADD CONSTRAINT \`fk_tbl_lookup_group_role-1\` FOREIGN KEY (GROUP_ID) REFERENCES TBL_GROUP(ID)`);
      await conn.query(`ALTER TABLE TBL_LOOKUP_GROUP_ROLE ADD CONSTRAINT \`fk_tbl_lookup_group_role-2\` FOREIGN KEY (ROLE_ID) REFERENCES TBL_ROLE(ID)`);

      await conn.query(`ALTER TABLE TBL_LOOKUP_USER_GROUP ADD CONSTRAINT \`fk_tbl_lookup_user_group-1\` FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID)`);
      await conn.query(`ALTER TABLE TBL_LOOKUP_USER_GROUP ADD CONSTRAINT \`fk_tbl_lookup_user_group-2\` FOREIGN KEY (GROUP_ID) REFERENCES  TBL_GROUP(ID)`);

      await conn.query(`ALTER TABLE TBL_LOOKUP_PRICING_STRUCTURE_GROUP ADD CONSTRAINT \`fk_tbl_lookup_pricing_structure_group-1\` FOREIGN KEY (PRICING_STRUCTURE_ID) REFERENCES TBL_PRICING_STRUCTURE(ID)`);
      await conn.query(`ALTER TABLE TBL_LOOKUP_PRICING_STRUCTURE_GROUP ADD CONSTRAINT \`fk_tbl_lookup_pricing_structure_group-2\` FOREIGN KEY (GROUP_ID) REFERENCES TBL_GROUP(ID)`);

      await conn.query(`ALTER TABLE TBL_PRICING_STRUCTURE ADD CONSTRAINT \`fk_tbl_pricing_structure-1\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
      await conn.query(`ALTER TABLE TBL_PRICING_STRUCTURE_ITEM ADD CONSTRAINT \`fk_tbl_pricing_structure_item-1\` FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID)`);
      await conn.query(`ALTER TABLE TBL_PRICING_STRUCTURE_ITEM ADD CONSTRAINT \`fk_tbl_pricing_structure_item-2\` FOREIGN KEY (PRICING_STRUCTURE_ID) REFERENCES TBL_PRICING_STRUCTURE(ID)`);

      await conn.query(`ALTER TABLE TBL_RULE ADD CONSTRAINT \`fk_tbl_rule-1\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
      await conn.query(`ALTER TABLE TBL_RULE_VALIDATE_CLAUSE ADD CONSTRAINT \`fk_tbl_rule_validate_clause-1\` FOREIGN KEY (RULE_ID) REFERENCES TBL_RULE(ID)`);
      await conn.query(`ALTER TABLE TBL_RULE_VALIDATE_CLAUSE ADD CONSTRAINT \`fk_tbl_rule_validate_clause-2\` FOREIGN KEY (VIEW_ATTRIBUTE_ID) REFERENCES TBL_VIEW_ATTRIBUTE(ID)`);
      await conn.query(`ALTER TABLE TBL_RULE_VALIDATE_CLAUSE_METADATA ADD CONSTRAINT \`fk_tbl_rule_validate_clause_metadata-1\` FOREIGN KEY (RULE_VALIDATE_CLAUSE_ID) REFERENCES TBL_RULE_VALIDATE_CLAUSE(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_RULE_VALIDATE_CLAUSE_METADATA_ENTRY ADD CONSTRAINT \`fk_tbl_rule_validate_clause_metadata_entry-1\` FOREIGN KEY (RULE_VALIDATE_CLAUSE_METADATA_ID) REFERENCES TBL_RULE_VALIDATE_CLAUSE_METADATA(ID) ON DELETE CASCADE`)
      await conn.query(`ALTER TABLE TBL_RULE_WHEN_CLAUSE ADD CONSTRAINT \`fk_tbl_rule_when_clause-1\` FOREIGN KEY (RULE_ID) REFERENCES TBL_RULE(ID)`);
      await conn.query(`ALTER TABLE TBL_RULE_WHEN_CLAUSE ADD CONSTRAINT \`fk_tbl_rule_when_clause-2\` FOREIGN KEY (VIEW_ATTRIBUTE_ID) REFERENCES TBL_VIEW_ATTRIBUTE(ID)`);
      await conn.query(`ALTER TABLE TBL_RULE_WHEN_CLAUSE_METADATA ADD CONSTRAINT \`fk_tbl_rule_when_clause_metadata-1\` FOREIGN KEY (RULE_WHEN_CLAUSE_ID) REFERENCES TBL_RULE_WHEN_CLAUSE(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_RULE_WHEN_CLAUSE_METADATA_ENTRY ADD CONSTRAINT \`fk_tbl_rule_when_clause_metadata_entry-1\` FOREIGN KEY (RULE_WHEN_CLAUSE_METADATA_ID) REFERENCES TBL_RULE_WHEN_CLAUSE_METADATA(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_ITEM ADD CONSTRAINT \`fk_tbl_item-1\` FOREIGN KEY (PARENT_ID) REFERENCES TBL_ITEM(ID)`);
      await conn.query(`ALTER TABLE TBL_ITEM ADD CONSTRAINT \`fk_tbl_item-2\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
      await conn.query(`ALTER TABLE TBL_ITEM_IMAGE ADD CONSTRAINT \`fk_tbl_item_image-1\` FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID)`);
      await conn.query(`ALTER TABLE TBL_VIEW_ATTRIBUTE ADD CONSTRAINT \`fk_tbl_view_attribute-1\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
      await conn.query(`ALTER TABLE TBL_VIEW_ATTRIBUTE_METADATA ADD CONSTRAINT \`fk_tbl_view_attribute_metadata-1\` FOREIGN KEY (VIEW_ATTRIBUTE_ID) REFERENCES TBL_VIEW_ATTRIBUTE(ID)`);
      await conn.query(`ALTER TABLE TBL_VIEW_ATTRIBUTE_METADATA_ENTRY ADD CONSTRAINT \`fk_tbl_view_attribute_metadata_entry-1\` FOREIGN KEY (VIEW_ATTRIBUTE_METADATA_ID) REFERENCES TBL_VIEW_ATTRIBUTE_METADATA(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_ITEM_VALUE ADD CONSTRAINT \`fk_tbl_item_value-1\` FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID)`);
      await conn.query(`ALTER TABLE TBL_ITEM_VALUE ADD CONSTRAINT \`fk_tbl_item_value-2\` FOREIGN KEY (VIEW_ATTRIBUTE_ID) REFERENCES TBL_VIEW_ATTRIBUTE(ID)`);
      await conn.query(`ALTER TABLE TBL_ITEM_VALUE_METADATA ADD CONSTRAINT \`fk_tbl_item_value_metadata-1\` FOREIGN KEY (ITEM_VALUE_ID) REFERENCES TBL_ITEM_VALUE(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_ITEM_VALUE_METADATA_ENTRY ADD CONSTRAINT \`fk_tbl_item_value_metadata_entry-1\` FOREIGN KEY (ITEM_VALUE_METADATA_ID) REFERENCES TBL_ITEM_VALUE_METADATA(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_DATA_IMPORT ADD CONSTRAINT \`fk_tbl_data_import-1\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
      await conn.query(`ALTER TABLE TBL_DATA_IMPORT_FILE ADD CONSTRAINT \`fk_tbl_data_import_file-1\` FOREIGN KEY (DATA_IMPORT_ID) REFERENCES TBL_DATA_IMPORT(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_DATA_EXPORT ADD CONSTRAINT \`fk_tbl_data_export-1\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID)`);
      await conn.query(`ALTER TABLE TBL_DATA_EXPORT_FILE ADD CONSTRAINT \`fk_tbl_data_export_file-1\` FOREIGN KEY (DATA_EXPORT_ID) REFERENCES TBL_DATA_EXPORT(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_JOB_LOG ADD CONSTRAINT \`fk_tbl_job_log-1\` FOREIGN KEY gg(JOB_ID) REFERENCES TBL_JOB(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_USER_SETTING ADD CONSTRAINT \`fk_tbl_user_setting-1\` FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_VIEW_VALIDATION ADD CONSTRAINT \`fk_tbl_view_validation-1\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_VIEW_VALIDATION_LOG ADD CONSTRAINT \`fk_tbl_view_validation_log-1\` FOREIGN KEY (VIEW_VALIDATION_ID) REFERENCES TBL_VIEW_VALIDATION(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_VIEW_VALIDATION_ERROR ADD CONSTRAINT \`fk_tbl_view_validation_error-1\` FOREIGN KEY (VIEW_VALIDATION_ID) REFERENCES TBL_VIEW_VALIDATION(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_VIEW_VALIDATION_ERROR ADD CONSTRAINT \`fk_tbl_view_validation_error-2\` FOREIGN KEY (RULE_ID) REFERENCES TBL_RULE(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_VIEW_VALIDATION_ERROR ADD CONSTRAINT \`fk_tbl_view_validation_error-3\` FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_VIEW_VALIDATION_ERROR ADD CONSTRAINT \`fk_tbl_view_validation_error-4\` FOREIGN KEY (VIEW_ATTRIBUTE_ID) REFERENCES TBL_VIEW_ATTRIBUTE(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_VIEW_VALIDATION_ERROR ADD CONSTRAINT \`fk_tbl_view_validation_error-5\` FOREIGN KEY (CUSTOM_RULE_ID) REFERENCES TBL_CUSTOM_RULE(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_CUSTOM_RULE_VIEW ADD CONSTRAINT \`fk_tbl_custom_rule-1\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_CUSTOM_RULE_VIEW ADD CONSTRAINT \`fk_tbl_custom_rule-2\` FOREIGN KEY (CUSTOM_RULE_ID) REFERENCES TBL_CUSTOM_RULE(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_VIEW_CATEGORY ADD CONSTRAINT \`fk_tbl_view_category-1\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_LOOKUP_VIEW_CATEGORY_ITEM ADD CONSTRAINT \`fk_tbl_lookup_view_category_item-1\` FOREIGN KEY (VIEW_CATEGORY_ID) REFERENCES TBL_VIEW_CATEGORY(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_LOOKUP_VIEW_CATEGORY_ITEM ADD CONSTRAINT \`fk_tbl_lookup_view_category_item-2\` FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_FORGOT_PASSWORD ADD CONSTRAINT \`fk_tbl_forgot_password-1\` FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID) ON DELETE CASCADE`);

      await conn.query(`ALTER TABLE TBL_FAVOURITE_ITEM ADD CONSTRAINT \`fk_tbl_favourite_item-1\` FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_FAVOURITE_ITEM ADD CONSTRAINT \`fk_tbl_favourite_item-2\` FOREIGN KEY (ITEM_ID) REFERENCES TBL_ITEM(ID) ON DELETE CASCADE`);
      
      await conn.query('ALTER TABLE TBL_WORKFLOW ADD CONSTRAINT \`fk_tbl_workflow-1\` FOREIGN KEY (WORKFLOW_DEFINITION_ID) REFERENCES TBL_WORKFLOW_DEFINITION(ID) ON DELETE CASCADE');
      await conn.query(`ALTER TABLE TBL_WORKFLOW ADD CONSTRAINT \`fk_tbl_workflow-2\` FOREIGN KEY (VIEW_ID) REFERENCES TBL_VIEW(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_WORKFLOW_ATTRIBUTE ADD CONSTRAINT \`fk_tbl_workflow_attribute-1\` FOREIGN KEY (WORKFLOW_ID) REFERENCES TBL_WORKFLOW(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_WORKFLOW_ATTRIBUTE ADD CONSTRAINT \`fk_tbl_workflow_attribute-2\` FOREIGN KEY (ATTRIBUTE_ID) REFERENCES TBL_VIEW_ATTRIBUTE(ID) ON DELETE CASCADE`);
      await conn.query('ALTER TABLE TBL_WORKFLOW_INSTANCE ADD CONSTRAINT \`fk_tbl_workflow_instance-1\` FOREIGN KEY (WORKFLOW_ID) REFERENCES TBL_WORKFLOW(ID) ON DELETE CASCADE');
      await conn.query(`ALTER TABLE TBL_WORKFLOW_INSTANCE_COMMENT ADD CONSTRAINT \`fk_tbl_workflow_instance_comment-1\` FOREIGN KEY (WORKFLOW_INSTANCE_ID) REFERENCES TBL_WORKFLOW_INSTANCE(ID) ON DELETE CASCADE`);
      await conn.query(`ALTER TABLE TBL_WORKFLOW_INSTANCE_COMMENT ADD CONSTRAINT \`fk_tbl_workflow_instance_comment-2\` FOREIGN KEY (USER_ID) REFERENCES TBL_USER(ID) ON DELETE CASCADE`);
      await conn.query('ALTER TABLE TBL_WORKFLOW_INSTANCE_LOG ADD CONSTRAINT \`fk_tbl_workflow_instance_log-1\` FOREIGN KEY (WORKFLOW_INSTANCE_ID) REFERENCES TBL_WORKFLOW_INSTANCE(ID) ON DELETE CASCADE');
      await conn.query('ALTER TABLE TBL_WORKFLOW_INSTANCE_TASK ADD CONSTRAINT \`fk_tbl_workflow_instance_approval-1\` FOREIGN KEY (WORKFLOW_INSTANCE_ID) REFERENCES TBL_WORKFLOW_INSTANCE(ID) ON DELETE CASCADE');
      await conn.query('ALTER TABLE TBL_WORKFLOW_INSTANCE_TASK ADD CONSTRAINT \`fk_tbl_workflow_instance_approval-2\` FOREIGN KEY (APPROVER_USER_ID) REFERENCES TBL_USER(ID) ON DELETE CASCADE');
   });
};




