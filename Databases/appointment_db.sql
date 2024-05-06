-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2023 at 03:15 PM
-- Server version: 8.0.34
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointment_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment_details`
--

CREATE TABLE `appointment_details` (
  `id` int NOT NULL,
  `patient_id` varchar(15) NOT NULL,
  `doctor_id` varchar(15) NOT NULL,
  `date` varchar(10) NOT NULL,
  `time` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) NOT NULL,
  `appointment_number` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointment_details`
--

INSERT INTO `appointment_details` (`id`, `patient_id`, `doctor_id`, `date`, `time`, `description`, `appointment_number`) VALUES
(3, '1', '1', '2023-10-25', '4:00 PM - 6:00 PM', 'Test description', '110-3251'),
(4, '1', '2', '2023-10-26', '6:00 PM - 8:00 PM', 'Test description', '110-262'),
(5, '1', '2', '2023-10-26', '6:00 PM - 8:00 PM', 'Test description', '110-262'),
(8, '1', '1', '2023-10-31', '6:00 PM - 8:00 PM', 'Dummy value 001', '110-312'),
(9, '1', '1', '2023-10-31', '6:00 PM - 8:00 PM', 'Dummy value 002', '110-312'),
(10, '6', '1', '2023-10-27', '6:00 PM - 8:00 PM', 'Dummy value 001', '610-272');

-- --------------------------------------------------------

--
-- Table structure for table `guest_appointments`
--

CREATE TABLE `guest_appointments` (
  `id` int NOT NULL,
  `guest_name` varchar(255) NOT NULL,
  `doctor_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date` varchar(20) NOT NULL,
  `time` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `appointment_number` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guest_appointments`
--

INSERT INTO `guest_appointments` (`id`, `guest_name`, `doctor_name`, `date`, `time`, `description`, `appointment_number`) VALUES
(1, 'Guest Patient', 'Doctor 001', '2023-10-22', 'test time', 'description', '111'),
(2, 'Guest Patient 002', 'Doctor 001', '2023-10-22', 'test time', 'description', '111121'),
(3, 'Guest Patient 003', 'Doctor 002 - test doctor', '2023-10-28', '6:00 PM - 8:00 PM', 'description', '9910-282'),
(4, 'Guest Patient 004', 'Doctor 002 - test doctor', '2023-10-28', '6:00 PM - 8:00 PM', 'description', '9910-282');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment_details`
--
ALTER TABLE `appointment_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `guest_appointments`
--
ALTER TABLE `guest_appointments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment_details`
--
ALTER TABLE `appointment_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `guest_appointments`
--
ALTER TABLE `guest_appointments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
