
#### Rename database
```SQL
mysqladmin -u root -p create fuyuko_temp

mysqldump -u root -v -p fuyuko | mariadb -u root -p -D fuyuko_temp

mysqladmin -u root -p drop fuyuko

```



#### Find all items metadata entries in a view
```SQL
SELECT * FROM TBL_ITEM_VALUE_METADATA_ENTRY WHERE ITEM_VALUE_METADATA_ID IN (
    SELECT ID FROM TBL_ITEM_VALUE_METADATA WHERE ITEM_VALUE_ID IN (
        SELECT ID FROM TBL_ITEM_VALUE WHERE ITEM_ID IN (
            SELECT ID FROM TBL_ITEM WHERE VIEW_ID=2
        )
    )
);

```