CREATE DATABASE occo;

USE occo;

CREATE TABLE checkpoints (
    cpid VARCHAR(30) PRIMARY KEY,
    lane VARCHAR(5)
);

CREATE TABLE Vehicle_Details (
    sno INT,
    rfid VARCHAR(30) PRIMARY KEY,
    BA_NO VARCHAR(30),
    Type_of_Veh VARCHAR(5) default "B",
    Unit VARCHAR(20),
    Formation VARCHAR(20),
    Lane VARCHAR(5),
    No_of_Trps INT,
    Purpose VARCHAR(30)
);

CREATE TABLE logs (
	log_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    rfid VARCHAR(30) references vehicle_details(rfid),
    cpid VARCHAR(30) references checkpoints(cpid),
    timestamp DATETIME
);

CREATE TABLE dummy_logs (
    log_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    rfid VARCHAR(30) references vehicle_details(rfid),
    cpid VARCHAR(30) references checkpoints(cpid),
    timestamp DATETIME
);