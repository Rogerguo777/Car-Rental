-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `driver_order`
--

DROP TABLE IF EXISTS `driver_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_order` (
  `dorder_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pickup_place` varchar(255) DEFAULT NULL,
  `dropoff_place` varchar(255) DEFAULT NULL,
  `pickup_date` date DEFAULT NULL,
  `pickup_time` time DEFAULT NULL,
  `distance_km` double DEFAULT NULL,
  `passenger_count` int DEFAULT NULL,
  `luggage_count` int DEFAULT NULL,
  `signage` tinyint(1) DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `adscar_id` bigint NOT NULL,
  `order_no` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dorder_id`),
  KEY `fk_order_car` (`adscar_id`),
  CONSTRAINT `fk_order_car` FOREIGN KEY (`adscar_id`) REFERENCES `adscar` (`adscar_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_order`
--

LOCK TABLES `driver_order` WRITE;
/*!40000 ALTER TABLE `driver_order` DISABLE KEYS */;
INSERT INTO `driver_order` VALUES (1,'David','0987654321','david@gmail.com','台北市','桃園國際機場','2025-11-30','11:02:00',45,4,0,1,4730,4,'ads001'),(2,'Jason','0912345878','jasonfake@gmail.com','桃園國際機場','台中市','2025-12-05','16:06:00',120,4,1,1,7280,4,'ads002'),(3,'Peter','0945612378','petersea@gmail.com','高雄市','桃園國際機場','2025-12-20','15:40:00',310,4,1,0,12010,3,'ads003'),(4,'Joel','0978451203','joel@gmail.com','桃園國際機場','台北市','2025-12-06','06:46:00',45,4,0,0,3795,3,'ads004');
/*!40000 ALTER TABLE `driver_order` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 14:03:24
