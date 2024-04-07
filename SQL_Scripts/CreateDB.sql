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

DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Cart;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Warehouse;
DROP TABLE IF EXISTS WeightTable;


CREATE TABLE Customer (
    ID INT(9) PRIMARY KEY AUTO_INCREMENT,
    CustomerName VARCHAR(50) NOT NULL,
    EmailAddress VARCHAR(60) NOT NULL,
    Country VARCHAR(50) NOT NULL,
    City VARCHAR(50) NOT NULL,
    State_ VARCHAR(50) NOT NULL,
    PostalCode VARCHAR(5) NOT NULL,
    AddressLine1 VARCHAR(99) NOT NULL,
    AddressLine2 VARCHAR(99) 
);



CREATE TABLE Warehouse (
    PartNumber INT(9) PRIMARY KEY AUTO_INCREMENT,
    Quantity INT NOT NULL  
);



CREATE TABLE WeightTable (
    WeightBracket INT PRIMARY KEY NOT NULL,
    ShippingPrice INT NOT NULL
);



CREATE TABLE Cart (
    ID INT(9) PRIMARY KEY AUTO_INCREMENT,
    QuantitySelected INT(2),
    Price INT(9) NOT NULL, 
    CustomerID INT(9) NOT NULL,
    WeightBracket INT(2) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customer(ID),
    FOREIGN KEY (WeightBracket) REFERENCES WeightTable(WeightBracket)          
);



CREATE TABLE Orders (
    TransactionID INT(9),
    Authorization INT(9) NOT NULL,
    OrderStatus VARCHAR(99),
    DateAndTime DATETIME NOT NULL DEFAULT now(),
    CustomerID INT(9) NOT NULL,
    PurchaseID INT(9) NOT NULL,
    PRIMARY KEY (TransactionID, CustomerID, PurchaseID),
    
    FOREIGN KEY (TransactionID) REFERENCES Cart(ID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(ID),
    FOREIGN KEY (PurchaseID) REFERENCES Cart(ID)
);



DESCRIBE Customer;
DESCRIBE Warehouse;
DESCRIBE WeightTable;
DESCRIBE Cart;
DESCRIBE Orders;