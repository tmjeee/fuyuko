
#### Rename database
```SQL
mysqladmin -u root -p create fuyuko_temp
mysqldump -u root -v -p fuyuko | mariadb -u root -p -D fuyuko_temp
mysqladmin -u root -p drop fuyuko
```

#### Find all roles for a user
```SQL
SELECT DISTINCT
    R.NAME 
FROM TBL_USER AS U
INNER JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.USER_ID = U.ID
INNER JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = LUG.GROUP_ID
INNER JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID 
WHERE U.ID = ?
```

#### Find all items in a view
```SQL
SELECT * 
FROM TBL_ITEM AS I
LEFT JOIN TBL_VIEW AS V ON V.ID = I.VIEW_ID = ?
```

#### Find all items values (metadata, entries etc) in a view
```SQL
SELECT * FROM TBL_ITEM_VALUE_METADATA_ENTRY WHERE ITEM_VALUE_METADATA_ID IN (
    SELECT ID FROM TBL_ITEM_VALUE_METADATA WHERE ITEM_VALUE_ID IN (
        SELECT ID FROM TBL_ITEM_VALUE WHERE ITEM_ID IN (
            SELECT ID FROM TBL_ITEM 
                WHERE VIEW_ID=2
        )
    )
);
```

```SQL
SELECT 
  VW.ID AS `VIEW_ID`,
  VW.NAME AS `VIEW_NAME`,
  I.ID AS `ITEM_ID`,
  I.NAME AS `ITEM_NAME`,
  A.ID AS `ATTRIBUTE_ID`,
  A.NAME AS `ATTRIBUTE_NAME`,
  V.ID AS `ITEM_VALUE_ID`,
  M.ID AS `ITEM_VALUE_METADATA_ID`,
  E.ID AS `ITEM_VALUE_METADATA_ENTRY_ID`,
  E.KEY AS `ITEM_VALUE_METADATA_ENTRY_KEY`,
  E.VALUE AS `ITEM_VALUE_METADATA_ENTRY_VALUE`,
  E.DATA_TYPE AS `ITEM_VALUE_METADATA_ENTRY_DATA_TYPE`
FROM TBL_VIEW AS VW
LEFT JOIN TBL_ITEM AS I ON I.VIEW_ID = VW.ID
LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID
LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = V.VIEW_ATTRIBUTE_ID
WHERE VW.ID=2;
```

#### Find values (metadata, entries etc.) in an item
```
SELECT
 I.ID AS ITEM_ID,
 I.NAME AS ITEM_NAME,
 A.ID AS ATTRIBUTE_ID, 
 A.NAME AS ATTRIBUTE_NAME,
 M.ID AS ITEM_METADATA_ID,
 M.NAME AS ITEM_METADATA_NAME,
 E.ID AS ITEM_METADATA_ENTRY_ID,
 E.KEY AS ITEM_METADATA_ENTRY_KEY,
 E.VALUE AS ITEM_METADATA_ENTRY_VALUE,
 E.DATA_TYPE AS ITEM_METADATA_ENTRY_DATA_TYPE
FROM TBL_ITEM AS I 
LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID
LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = V.VIEW_ATTRIBUTE_ID
WHERE I.ID = 1

```