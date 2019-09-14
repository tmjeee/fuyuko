import {PoolConnection} from "mariadb";
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
         CREATE TABLE IF NOT EXISTS TBL_USER_GROUP (
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
        `);
    });

    // ALTER TABLE TBL_GROUP ADD CONSTRAINT FOREIGN KEY (PRICING_STRUCTURE_ID) REFERENCES TBL_PRICING_STRUCTURE(ID)
};



