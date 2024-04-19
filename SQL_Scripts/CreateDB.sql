############################################
#                                          #
#  CSCI 467      GROUP PROJECT    SEC: 01  #
#					                       #
#  THIS SQL script will first check if     #
#  the database exists. If so, it deletes  #
#  the old tables and recreates them and   #
#  fills them with the updated data.       #                                        
#                                          #
#    By:    Milad Jizan      Z1943173      #
#           Chris Dejong     Z1836870      #
#           Ryan Solfsburg   Z1976726      #  
#           Anita Ye         Z1950694      #
#                                          #
############################################


# Delete tables if they alredy exist.

DROP TABLE IF EXISTS Purchase;
DROP TABLE IF EXISTS LineItem;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Warehouse;
DROP TABLE IF EXISTS WeightTable;



CREATE TABLE Customer (
    ID INT(9) PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(60),
    country VARCHAR(50),
    city VARCHAR(50),
    customer_state VARCHAR(50),
    postal_code VARCHAR(10),
    Address_line1 VARCHAR(99),
    Address_line2 VARCHAR(99) 
);



CREATE TABLE WeightTable (
    ID INT(9) PRIMARY KEY NOT NULL,
    weight_catagory int(5) NOT NULL, 
    price INT(7) NOT NULL
);



CREATE TABLE Warehouse (
    ID INT(9) PRIMARY KEY,
    quantity INT(7) NOT NULL  
);



CREATE TABLE LineItem (
    ID INT(9) NOT NULL,
    part_number INT(9) NOT NULL,
    quantity INT(7),
    PRIMARY KEY (ID, part_number),

    FOREIGN KEY (part_number) REFERENCES Warehouse(ID)
);



CREATE TABLE Purchase (
    transaction_ID INT(9) NOT NULL,
    customer_ID INT(9) NOT NULL,
    bracket_ID INT(9) NOT NULL,
    authorization_code INT(9),
    order_status VARCHAR(99),
    DateAndTime DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY (transaction_ID, customer_ID, bracket_ID),
    
    FOREIGN KEY (transaction_ID) REFERENCES LineItem(ID),
    FOREIGN KEY (customer_ID) REFERENCES Customer(ID),
    FOREIGN KEY (bracket_ID) REFERENCES WeightTable(ID)
);




#DESCRIBE Customer;
#DESCRIBE WeightTable;
#DESCRIBE Warehouse;
#DESCRIBE LineItem;
#DESCRIBE Purchase;



\. Customer.sql
\. WeightTable.sql
\. Warehouse.sql



SELECT * FROM Customer;
SELECT * FROM WeightTable;
SELECT * FROM Warehouse;