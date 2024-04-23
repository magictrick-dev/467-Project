import fs from 'node:fs';
import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();

async function main()
{

    // Define the customer database.
    let customer_table_schema = `
        CREATE TABLE Customer (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
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
    `;

    let weight_table_schema = `
        CREATE TABLE WeightTable (
            ID INTEGER PRIMARY KEY NOT NULL,
            weight_maximum INTEGER NOT NULL, 
            price REAL NOT NULL
        );
    `;

    let warehouse_table_schema = `
        CREATE TABLE Warehouse (
            PartID INTEGER PRIMARY KEY,
            quantity INTEGER NOT NULL  
        );
    `;

    let lineitem_table_schema = `
        CREATE TABLE LineItem (
            ID INTEGER NOT NULL,
            part_number INTEGER NOT NULL,
            quantity INTEGER,
            PRIMARY KEY (ID, part_number)
        );
    `;

    let purchase_table_schema = `
        CREATE TABLE Purchase (
            transaction_ID VARCHAR(50) NOT NULL,
            customer_ID INTEGER NOT NULL,
            bracket_ID INTEGER NOT NULL,
            authorization_code INTEGER,
            order_status VARCHAR(99),
            DateAndTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            total REAL NOT NULL,
            PRIMARY KEY (transaction_ID),
            FOREIGN KEY (transaction_ID) REFERENCES LineItem(ID),
            FOREIGN KEY (customer_ID) REFERENCES Customer(ID),
            FOREIGN KEY (bracket_ID) REFERENCES WeightTable(ID)
        );
    `;

    let customers = `
        INSERT INTO Customer (first_name, last_name, email, country, city, customer_state,
            postal_code, Address_line1, Address_line2) VALUES
            ('Richard', 'Enball', 'denball@gmail.com', 'USA', 'New York', 'NY', '16969', '123 Main St', 'Apt 1'),
            ('Michael', 'Jordan', 'michael@NBA.com', 'UK', 'London', '', 'W1D 4AG', '789 Oak St', 'Flat 2'),
            ('James', 'Whitehurst', 'Whitehurst@thanksAlotEA.com', 'Australia', 'Sydney', 'NSW', '2000', '101 Elm St', ''),
            ('David', 'Attenborough', 'david@IStillDrive.com', 'France', 'Paris', '', '75001', '321 Pine St', 'Unité B'),
            ('Todd', 'Howard', 'Todd@ItsABathesdaGame.com', 'Germany', 'Berlin', '', '10115', '567 Cedar St', ''),
            ('Daniel', 'Rogness', 'daniel@yahoo.com', 'Spain', 'Madrid', '', '28001', '890 Birch St', ''),
            ('James', 'Stephans', 'jstephans@corprateSpy.com', 'Italy', 'Rome', '', '00100', '234 Maple St', ''),
            ('Yves', 'Guillemot', 'Guillemot@AAAAgames.com', 'Japan', 'Tokyo', '', '100-0001', '678 Oak St', ''),
            ('Bilbo', 'Baggins', 'B.baggins@myPrecious.com', 'Brazil', 'Rio de Janeiro', 'RJ', '20040-020', '135 Pine St', '');
    `;

    let weights = `
        INSERT INTO WeightTable (ID, weight_maximum, price) VALUES
            (1, 15,  14.54),
            (2, 20,  21.98),
            (3, 30,  33.21),
            (4, 50,  87.21),
            (5, 100, 142.73);
    `;

    let warehouse = `
        INSERT INTO Warehouse (PartID, quantity) VALUES
            (1, 69),
            (2, 62),
            (3, 63),
            (4, 78),
            (5, 300),
            (6, 20),
            (7, 4),
            (8, 50),
            (9, 10),
            (10, 750);
    `;

    let lineitems = `
        INSERT INTO LineItem (ID, part_number, quantity) VALUES
            ('26720b98-3c20-4833-9370-7168fa0e1f66', 1, 1),
            ('26720b98-3c20-4833-9370-7168fa0e1f66', 2, 1),
            ('26720b98-3c20-4833-9370-7168fa0e1f66', 3, 4),
            ('ab7e69f7-9adc-49cd-935c-f2ed3840fae8', 2, 1),
            ('e8d6a68c-4545-4cd7-8abf-9b61b61e6917', 3, 1),
            ('5620b320-dc08-405d-8914-3a2ff8299218', 4, 1),
            ('fdba4bc4-7266-49f7-b902-0391dcfa927c', 5, 1),
            ('67594367-9852-41c2-8f0b-e78cbf3ea97d', 6, 1),
            ('a7e465d4-0fa3-422a-995c-b2f90da20eaa', 7, 1),
            ('44948768-2372-496a-b18f-1764ebc3d376', 8, 1),
            ('de8d8b07-a00f-4572-ad04-b87e7adbd671', 9, 1);
    `;

    let purchases = `
        INSERT INTO Purchase (transaction_ID, customer_ID, bracket_ID, authorization_code, order_status, DateAndTime, total) VALUES
            ('26720b98-3c20-4833-9370-7168fa0e1f66', 1, 2, 123456, 'Processing', '1713539255000', '56.17'),
            ('ab7e69f7-9adc-49cd-935c-f2ed3840fae8', 2, 1, 654321, 'Processing', '1713625655000', '32.25'),
            ('e8d6a68c-4545-4cd7-8abf-9b61b61e6917', 3, 1, NULL, 'Processing', '1713798455000', '19.89'),
            ('5620b320-dc08-405d-8914-3a2ff8299218', 4, 1, 987654, 'Completed', '1712848055000', '25.01'),
            ('fdba4bc4-7266-49f7-b902-0391dcfa927c', 5, 1, NULL, 'Processing', '1710169655000', '98.12'),
            ('67594367-9852-41c2-8f0b-e78cbf3ea97d', 6, 1, 246810, 'Processing', '1710688055000', '33.66'),
            ('a7e465d4-0fa3-422a-995c-b2f90da20eaa', 7, 1, 135792, 'Completed',  '1710947255000', '12.33'),
            ('44948768-2372-496a-b18f-1764ebc3d376', 8, 1, NULL, 'Processing', '1710947255000', '69.82'),
            ('de8d8b07-a00f-4572-ad04-b87e7adbd671', 9, 1, 369258, 'Delivered', '1712502455000', '142.08');
    `;

    let fetch_order = `
        SELECT * FROM Purchase JOIN Customer ON Purchase.Customer_ID=Customer.ID WHERE transaction_ID = '26720b98-3c20-4833-9370-7168fa0e1f66';
    `;

    let fetch_detail = `
        SELECT * FROM LineItem JOIN Purchase ON Purchase.transaction_ID = LineItem.ID WHERE ID = '26720b98-3c20-4833-9370-7168fa0e1f66';
    `;

    let fetch_full_order = `
        SELECT * FROM LineItem
        JOIN Purchase ON Purchase.transaction_ID = LineItem.ID
        JOIN Customer ON Purchase.Customer_ID = Customer.ID
        WHERE LineItem.ID = '26720b98-3c20-4833-9370-7168fa0e1f66';
    `;

    // Instantiate the database.
    let database_instance = new sqlite.Database("./db/projectdb.sl3");
    database_instance.serialize(() => {
        
        /*
        // Clear all existing tables from the database.
        console.log("Clearing all existing tables.\n")
        database_instance.run("DROP TABLE Customer;", (error) => {
            if (error) console.log("Error, customer table probably doesn't exist.");
        });

        database_instance.run("DROP TABLE WeightTable;", (error) => {
            if (error) console.log("Error, weight table probably doesn't exist.");
        });

        database_instance.run("DROP TABLE Warehouse;", (error) => {
            if (error) console.log("Error, warehouse table probably doesn't exist.");
        });

        database_instance.run("DROP TABLE LineItem;", (error) => {
            if (error) console.log("Error, line item table probably doesn't exist.");
        });

        database_instance.run("DROP TABLE Purchase;", (error) => {
            if (error) console.log("Error, purchases table probably doesn't exist.");
        });

        // Recreate all the tables.
        database_instance.run(customer_table_schema, (error) => {
            if (error) console.log(error);
            else console.log("Customer table has been created.");
        });

        database_instance.run(weight_table_schema, (error) => {
            if (error) console.log(error);
            else console.log("Weight table has been created.");
        });

        database_instance.run(warehouse_table_schema, (error) => {
            if (error) console.log(error);
            else console.log("Warehouse table has been created.");
        });

        database_instance.run(lineitem_table_schema, (error) => {
            if (error) console.log(error);
            else console.log("Line item table has been created.");
        });

        database_instance.run(purchase_table_schema, (error) => {
            if (error) console.log(error);
            else console.log("Purchases table has been created.");
        });

        database_instance.all("select name from sqlite_master where type='table'", function (err, tables) {
            console.log("\nList of tables after script processing:")
            console.log(tables);
        });

        // Now chuck some initial data into these tables.
        database_instance.run(customers, (error) => {
            if (error) console.log(error);
        });
        database_instance.all("SELECT * FROM Customer;", (error, data) => {
            if (error) console.log(error);
            else
            {
                console.log("\nRows added to Customer: " + data.length);
                console.log("Sample row:");
                console.log(data[0]);
            }
        });

        database_instance.run(weights, (error) => {
            if (error) console.log(error);
        });

        database_instance.all("SELECT * FROM WeightTable;", (error, data) => {
            if (error) console.log(error);
            else
            {
                console.log("\nRows added to WeightTable: " + data.length);
                console.log("Sample row:");
                console.log(data[0]);
            }
        });

        database_instance.run(warehouse, (error) => {
            if (error) console.log(error);
        });

        database_instance.all("SELECT * FROM Warehouse;", (error, data) => {
            if (error) console.log(error);
            else
            {
                console.log("\nRows added to Warehouse: " + data.length);
                console.log("Sample row:");
                console.log(data[0]);
            }
        });

        database_instance.run(lineitems, (error) => {
            if (error) console.log(error);
        });

        database_instance.all("SELECT * FROM LineItem;", (error, data) => {
            if (error) console.log(error);
            else
            {
                console.log("\nRows added to LineItem: " + data.length);
                console.log("Sample row:");
                console.log(data[0]);
            }
        });

        database_instance.run(purchases, (error) => {
            if (error) console.log(error);
        });

        database_instance.all("SELECT * FROM LineItem;", (error, data) => {
            if (error) console.log(error);
            else
            {
                console.log("\nRows added to Purchases: " + data.length);
                console.log("Sample row:");
                console.log(data[0]);
            }
        });

        database_instance.all(fetch_order, (error, data) => {
            if (error) console.log(error);
            else console.log(data);
        });

        console.log("\nFetch order detail test:");
        database_instance.all(fetch_detail, (error, data) => {
            if (error) console.log(error);
            else console.log(data);
        });

        console.log("\nFetch full order detail test:");
        database_instance.all(fetch_full_order, (error, data) => {
            if (error) console.log(error);
            else console.log(data);
        });
        */

        database_instance.all("SELECT * FROM Purchase", (error, data) => {
            console.log(data);
        });

        let fetch_test = `
        SELECT * FROM LineItem
        JOIN Purchase ON Purchase.transaction_ID = LineItem.ID
        JOIN Customer ON Purchase.Customer_ID = Customer.ID
        WHERE LineItem.ID = '46c27d7f-0f20-492b-b1b1-44a6ee93788e';
        `;

        database_instance.all(fetch_test, (error, data) => {
            console.log(data);
        });
    
    });

}

main();
