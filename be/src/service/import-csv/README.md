# Data import 
Following data import are allowed
* Attributes Import
* Item Import
* Pricing Import

## Attributes Import
Attribute import follows the following csv format

|csv header # |csv header| Applicable Types | Description|
|-------------|----------|------------------|------------|
| 1 | name | all types | name of the attribute  |
| 2 | description | all types | description of the attribute |
| 3 | type | all types | type of the attribute. Valid values are 'string', 'text', 'number', 'currency', 'volume', 'dimension', 'area', 'length', 'width', 'height', 'select', 'doubleseect'|
| 4 | format | 'number', 'date', 'volume', 'dimension', 'area', 'length', 'width', 'height' | attribute format |
| 5 | showCurrencyCountry | currency | show currency country|
| 6 | pair1 | 'select', 'doubleselect' | key of select, key1 of doubleselect |
| 7 | pair2 | 'doubleselect' | key2 of doubleselect |

##### Following are the formats :-
|Format| Description | Example |
|------|-------------|---------|
|date  | Format for date type |  DD - day, MM - month, YY- year eg. DD/MM/YYYY see [moment format]() |
|number, volume, dimension, area, length, width, height | format for numeric data |  0.0 for a single decimal see [numeraljs format]() |
|showCurrencyCountry| To show the currency unit | true or false |
|pair1| key | any string |
|pair2| key | any string |

##### Example of csv
```
name,description,type,format,showCurrencyCountry,pair1,pair2
att01,att 01 description,string,,,,
att02,att 02 description,text,,,,
att03,att 03 description,number,0.0,,
att04,att 04 description,date,DD/MM/YYYY,,
att05,att 05 description,currency,,true,,
att06,att 06 description,volume,0.0,,,
att07,att 07 description,dimension,0.0,,,
att08,att 08 description,area,0.0,,,
att09,att 09 description,width,0.0,,,
att10,att 10 description,length,0.0,,,
att11,att 11 description,height,0.0,,,
att12,att 12 description,select,,,key1=value1|key2=value2|key3=value3,
att13,att 13 description,doubleselect,,,key1=value1|key2=value2|key3=value3,key1=xkey11=xvalue11|key1=xkey12=xvalue12|key2=xkey21=xvalue21|key2=xkey22=xvalue22|key3=xkey31=xvalue31|key3=xkey32=xvalue32
```


## Items Import

|csv header # | csv header | Description |
|-------------|------------|-------------|
|1 | parentName| Item parent name |
|2 | name | Item name | 
|3 | description | Item description | 
|4 | attribute | Item attributes. Can have as many as one wishes. see below for example and format |

Attribute format

| Attribute Format | Description |
|------------------|-------------|
| attName=`<attribute name>` | where `<attribute name>` is the attribute name  |
| attId=`<attribute id>` | where `<attribute id>` is the attribute id |



##### Example of csv
```
parentName,name,description,attName=att01,attName=att02,attName=att03,attId=17,attName=att05,attName=att06,attName=att07,attName=att08,attName=att09,attName=att10,attName=att11,attName=att12,attName=att13
,item 1,item 1 description,some string,some text,10.0,10-09-2018,23.50,11.11|l,12.01|13.01|14.01|m,11|m2,33|m,44|m,55|m,key2,key3|xkey31
item 1,item 1_1,item 1_1 description,some string,some text,10.0,10-09-2018,23.50,11.11|l,12.01|13.01|14.01|m,11|m2,33|m,44|m,55|m,key2,key3|xkey31
item 1_1,item 1_1_1,item 1_1_1 description,some string,some text,10.0,10-09-2018,23.50,11.11|l,12.01|13.01|14.01|m,11|m2,33|m,44|m,55|m,key2,key3|xkey31
item 1_1_1,item 1_1_1_1,item 1_1_1_1 description,some string,some text,10.0,10-09-2018,23.50,11.11|l,12.01|13.01|14.01|m,11|m2,33|m,44|m,55|m,key2,key3|xkey31
,item 2,item 2 description,some string,some text,10.0,10-09-2018,23.50,11.11|l,12.01|13.01|14.01|m,11|m2,33|m,44|m,55|m,key2,key3|xkey31
,item 3,item 3 description,some string,some text,10.0,10-09-2018,23.50,11.11|l,12.01|13.01|14.01|m,11|m2,33|m,44|m,55|m,key2,key3|xkey31
```


## Pricing Import

|csv header # | csv header | Description |
|-------------|------------|-------------|
|1 | addToPricingStructureIfItemNotAlreadyAdded| to add item to pricing structure if not already exists, boolean. |
|2 | pricingStructureFormat| see pricing structure format below |
|3 | itemFormat| see item format table below |
|4 | price| price eg. 10.10 |
|5 | currency| currency unit eg. AUD |

|`addToPricingStructureIfItemNotAlreadyAdded` format| Description|
|---------------------------------------------------| ------------|
|true | add price and item to  pricing structure if not already exists |
|false | only update price if item is already in pricing structure |


|`pricingStructureFormat` format| Description |
|------------------------|-------------|
|id=`<pricing structure id>` | |
|name=`<pricing structure name>`| |

|`itemFormat` format | Description |
| ------------------ | ----------- |
|id=`<item id>` | where `<item id>` is the item's id |
|name=`<item name>` | where `<item name>` is the item's name|


##### Example of csv
```
addToPricingStructureIfItemNotAlreadyAdded,pricingStructureFormat,itemFormat,price,country
true,id=2,id=15,20.50,AUD
true,name=Pricing Structure #2,name=item 3,10.10,AUD
```
