-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 04, 2026 at 10:17 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u891495087_medai_db1`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `admin_id`, `action`, `description`, `ip_address`, `created_at`) VALUES
(1, 1, 'login', 'User logged in', '2406:7400:ff03:3bba:38b1:f303:8da9:1549', '2026-02-26 10:47:20'),
(2, 1, 'login', 'User logged in', '2406:7400:ff03:3bba:38b1:f303:8da9:1549', '2026-02-26 10:48:55'),
(3, 1, 'login', 'User logged in', '2406:7400:ff03:3bba:c5f7:d16c:9be0:29ea', '2026-02-26 12:13:22'),
(4, 1, 'login', 'User logged in', '2406:7400:ff03:3bba:c5f7:d16c:9be0:29ea', '2026-02-26 12:14:38'),
(5, 1, 'login', 'User logged in', '2406:7400:ff03:a1ec:6c32:c8db:2aeb:2a0f', '2026-03-02 12:27:04'),
(6, 6, 'login', 'User logged in', '2406:7400:ff03:a1ec:b528:d39c:f4e5:4c38', '2026-03-02 13:22:03'),
(7, 6, 'login', 'User logged in', '183.83.185.164', '2026-03-03 10:18:04'),
(8, 6, 'login', 'User logged in', '183.83.185.164', '2026-03-03 11:21:59');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('admin','manager','viewer') DEFAULT 'viewer',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `email`, `full_name`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@medai.in', 'MEDAI Admin', 'admin', 1, '2026-03-02 12:27:04', '2026-02-26 10:45:50', '2026-03-02 12:27:04'),
(6, 'kamal', '$2y$10$sT3Loh/oEZ3YV2guZc6KcOrxvw5TnfQE4F7ihbcUdojw/gafQUZN6', 'kamal@medai.in', 'Kamal', 'admin', 1, '2026-03-03 11:21:59', '2026-03-02 13:18:35', '2026-03-03 11:21:59');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_reference` varchar(20) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `billing_address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `location` varchar(100) NOT NULL,
  `event_date` date NOT NULL,
  `event_time` varchar(50) NOT NULL,
  `ticket_type` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  `razorpay_order_id` varchar(100) DEFAULT NULL,
  `razorpay_payment_id` varchar(100) DEFAULT NULL,
  `booking_status` enum('confirmed','cancelled','pending') DEFAULT 'pending',
  `special_requests` text DEFAULT NULL,
  `purpose` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_reference`, `event_id`, `name`, `email`, `phone`, `gst_number`, `company_name`, `billing_address`, `city`, `state`, `zip_code`, `location`, `event_date`, `event_time`, `ticket_type`, `quantity`, `total_amount`, `payment_status`, `razorpay_order_id`, `razorpay_payment_id`, `booking_status`, `special_requests`, `purpose`, `created_at`, `updated_at`) VALUES
(1, 'MEDAI-90155D4F', NULL, 'kishore', 'ki9shore@gmail.com', 'fwawaw', 'asfasf', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-02-27', '07:00 AM – 10:00 AM', 'Space Rental', 2, 35400.00, 'completed', NULL, NULL, 'confirmed', 'Purpose: asfasf. Slot: C1 (3 Hours)', '', '2026-02-26 12:13:54', '2026-02-26 12:13:54'),
(2, 'MEDAI-D9B436FF', NULL, 'Ajay A', 'ajayselvaas6@gmail.com', '443634634656', 'dfhdrfrfy h', 'fdhbfhzrfyh', 'New Keeranatham Rd, Saravanampatti, Coimbatore, Tamil Nadu', 'Coimbatore', 'Tamil Nadu', '641035', 'CHENNAI', '2026-02-28', '07:00 AM – 10:00 AM', 'Space Rental', 2, 35400.00, 'completed', NULL, NULL, 'confirmed', 'Purpose: hreyhry. Slot: C1 (3 Hours)', '', '2026-02-27 06:45:47', '2026-02-27 06:45:47'),
(3, 'MEDAI-23CECCA7', NULL, 'kishore', 'ki9shore@gmail.com', '123456789', 'test12', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-02-28', '07:00 AM – 10:00 AM', 'Space Rental', 2, 2.00, '', 'order_SLWzumyR8KIjFG', 'pay_SLX0UhrpGAzHvl', 'confirmed', 'Purpose: test. Slot: C1 (3 Hours)', 'test', '2026-02-28 10:23:57', '2026-02-28 10:23:57'),
(4, 'MEDAI-0D50BAB4', NULL, 'kishore', 'ki9shore@gmail.com', '6379727163', 'fsdhdfh', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-02-28', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'order_SLY3iugkQik3LX', 'pay_SLY4W4ECJuEHaE', 'confirmed', 'Purpose: fhsfdh. Slot: C1 (3 Hours)', 'fhsfdh', '2026-02-28 11:26:13', '2026-02-28 11:26:13'),
(5, 'MEDAI-2C99D5E6', NULL, 'kishore', 'rishisaran7867@gmail.com', '7871873038', 'test', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-02-28', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'order_SLYCpm53xCpjlj', 'pay_SLYDLOjgmnDiGT', 'confirmed', 'Purpose: test. Slot: C1 (3 Hours)', 'test', '2026-02-28 11:34:34', '2026-02-28 11:34:34'),
(6, 'MEDAI-92247433', NULL, 'kishore', 'rishisaran7867@gmail.com', '7871873038', 'test123', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-02-28', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'order_SLYfZmTobJG50P', 'pay_SLYfxCFr5LM1he', 'confirmed', 'Purpose: test. Slot: C1 (3 Hours)', 'test', '2026-02-28 12:01:38', '2026-02-28 12:01:38'),
(7, 'MEDAI-BC13660A', NULL, 'kishore', 'rishisaran7867@gmail.com', '7871873038', 'test123', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-02-28', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'order_SLYpHxqKgrbqvH', 'pay_SLYrjGOOAadBTU', 'confirmed', 'Purpose: test. Slot: C1 (3 Hours)', 'test', '2026-02-28 12:12:49', '2026-02-28 12:12:49'),
(8, 'MEDAI-159B8E24', NULL, 'Yuva Raja', 'yuvar1018@gmail.com', '9585059823', '', 'Techinta', 'Kk Nagar\nSekapatty', 'Sirunayakkanpatty', 'Tamil Nadu', '624219', 'CHENNAI', '2026-02-28', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'order_SLckiQW5a3q8Aj', 'pay_SLclKBwGiWZUmY', 'confirmed', 'Slot: C1 (3 Hours)', '', '2026-02-28 16:01:30', '2026-02-28 16:01:30'),
(9, 'MEDAI-3E749953', NULL, 'Yuva Raja', 'yuvar1018@gmail.com', '9585059823', '', 'techinta', 'Kk Nagar\nSekapatty', 'Sirunayakkanpatty', 'Tamil Nadu', '624219', 'CHENNAI', '2026-02-28', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'order_SLcwKfsX46yzit', 'pay_SLcwp9FH4u3KGc', 'confirmed', 'Slot: C1 (3 Hours)', '', '2026-02-28 16:12:23', '2026-02-28 16:12:23'),
(10, 'MEDAI-AC7346D6', NULL, 'kishore', 'ki9shore@gmail.com', '6379727163', '', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-03-02', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'pay_test_1772436164450', 'order_test_1772436164450', 'confirmed', 'Purpose: dfgdr. Slot: C1 (3 Hours)', 'dfgdr', '2026-03-02 07:22:47', '2026-03-02 07:22:47'),
(11, 'MEDAI-0E8346A5', NULL, 'kishore', 'rishisaran7867@gmail.com', '7418529630', '', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-03-02', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'pay_test_1772437733443', 'order_test_1772437733443', 'confirmed', 'Slot: C1 (3 Hours)', '', '2026-03-02 07:48:56', '2026-03-02 07:48:56'),
(12, 'MEDAI-9718A376', NULL, 'kishore', 'rishisaran7867@gmail.com', '7871873038', '', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-03-02', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'pay_test_1772439918749', 'order_test_1772439918749', 'confirmed', 'Purpose: ffd. Slot: C1 (3 Hours)\nZoho Invoice ID: 3612443000000036199', 'ffd', '2026-03-02 08:25:21', '2026-03-02 08:25:22'),
(13, 'MEDAI-ECE15F8A', NULL, 'kishore', 'rishisaran7867@gmail.com', '8529637410', 'tgjtgjtgfuj432786785', 'fetwt', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-03-02', '07:00 AM – 10:00 AM', 'Space Rental', 2, 2.00, '', 'pay_test_1772441291274', 'order_test_1772441291274', 'confirmed', 'Purpose: Music Event. Slot: C1 (3 Hours)\nZoho Invoice ID: 3612443000000037183', 'Music Event', '2026-03-02 08:48:14', '2026-03-02 08:48:14'),
(14, 'MEDAI-0A084680', NULL, 'kishore', 'rishisaran7867@gmail.com', '8529637410', 'tgjtgjtgfuj432786785', 'tests', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-03-02', '07:00 AM – 10:00 AM', 'Space Rental', 2, 2.00, '', 'pay_test_1772441757773', 'order_test_1772441757773', 'confirmed', 'Purpose: Music Event. Slot: C1 (3 Hours)\nZoho Invoice ID: 3612443000000037199', 'Music Event', '2026-03-02 08:56:00', '2026-03-02 08:56:01'),
(15, 'MEDAI-41FF121E', NULL, 'kishore', 'rishisaran7867@gmail.com', '7418529630', 'tset56', 'test', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'CHENNAI', '2026-03-02', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'pay_test_1772446749118', 'order_test_1772446749118', 'confirmed', 'Purpose: tset. Slot: C1 (3 Hours)\nZoho Invoice ID: 3612443000000042001', 'tset', '2026-03-02 10:19:11', '2026-03-02 10:19:13'),
(16, 'MEDAI-43F07458', NULL, 'kishore', 'rishisaran7867@gmail.com', '7418529630', 'tset56', 'test', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'BENGALURU', '2026-03-02', '03:00 PM – 09:00 PM', 'Space Rental', 1, 53100.00, '', 'pay_test_1772446780180', 'order_test_1772446780180', 'confirmed', 'Purpose: tset. Slot: B1 (6 Hours)\nZoho Invoice ID: 3612443000000041002', 'tset', '2026-03-02 10:19:43', '2026-03-02 10:19:43'),
(17, 'MEDAI-643B2904', NULL, 'kishore', 'ki9shore@gmail.com', '741852630', 'dgzdgdg', 'terttest', 'lfjifudhrf', 'aravnampapti', 'tamil nadu', '6256605', 'BENGALURU', '2026-03-02', '03:00 PM – 09:00 PM', 'Space Rental', 1, 53100.00, '', 'pay_test_1772447296901', 'order_test_1772447296901', 'confirmed', 'Purpose: sfzsf. Slot: B1 (6 Hours)\nZoho Invoice ID: 3612443000000041036', 'sfzsf', '2026-03-02 10:28:19', '2026-03-02 10:28:21'),
(18, 'MEDAI-6A8B68A3', NULL, 'Saran', 'rishisaran7867@gmail.com', '7871873038', 'test123', 'Techinta', 'Mugai Tech', 'Coimbatore', 'tamil nadu', '641035', 'CHENNAI', '2026-03-04', '07:00 AM – 10:00 AM', 'Space Rental', 2, 2.00, '', 'pay_test_1772447397944', 'order_test_1772447397944', 'confirmed', 'Purpose: Music event. Slot: C1 (3 Hours)\nZoho Invoice ID: 3612443000000041078', 'Music event', '2026-03-02 10:30:00', '2026-03-02 10:30:02'),
(19, 'MEDAI-FFFE2689', NULL, 'Saran', 'rishisaran7867@gmail.com', '7871873038', '', 'Mugai', 'Techinta', 'Coimbatore', 'tamil nadu', '641035', 'CHENNAI', '2026-03-01', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, '', 'order_SMNBFTCODcLxbR', 'pay_SMNBhvI8J63Aod', 'confirmed', 'Purpose: dance. Slot: C1 (3 Hours)', 'dance', '2026-03-02 13:26:23', '2026-03-02 13:26:23'),
(20, 'MEDAI-2255C958', NULL, 'Saran', 'rishisaran7867@gmail.com', '7871873038', '', 'Mugai', 'Techinta', 'Coimbatore', 'tamil nadu', '641035', 'CHENNAI', '2026-03-02', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, 'completed', 'order_SMNKqIeUnrWWTS', 'pay_SMNLN5rLigbHJ3', 'confirmed', 'Purpose: dance. Slot: C1 (3 Hours)', 'dance', '2026-03-02 13:35:33', '2026-03-02 13:35:33'),
(21, 'MEDAI-9E7AB5E6', NULL, 'karthick s', 'emptyinbox101@gmail.com', '8220979370', '', '', 'kk nagar\nponnambalam street, kk nagar', 'Chennai', 'Tamil Nadu', '600078', 'CHENNAI', '2026-03-07', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, 'completed', 'order_SMgVeTM78p8JNB', 'pay_SMgW8iejK3mrUz', 'confirmed', 'Purpose: Music video promo shoot. Slot: C1 (3 Hours)\nZoho Invoice ID: 3612443000000045001', 'Music video promo shoot', '2026-03-03 08:20:55', '2026-03-03 08:20:57'),
(22, 'MEDAI-3D9D698D', NULL, 'Kamalhassan M', 'kamal23.work@gmail.com', '9789728023', '', '', '18, T Valasai, Veraiyur', 'Tiruvannamalai', 'Tamil Nadu', '606806', 'CHENNAI', '2026-03-06', '07:00 AM – 10:00 AM', 'Space Rental', 1, 1.00, 'completed', 'order_SMiOOcBVUCTnvV', 'pay_SMiP4YzssjRHVl', 'confirmed', 'Slot: C1 (3 Hours)\nZoho Invoice ID: 3612443000000044020', '', '2026-03-03 10:11:37', '2026-03-03 10:11:39');

-- --------------------------------------------------------

--
-- Stand-in structure for view `booking_statistics`
-- (See below for the actual view)
--
CREATE TABLE `booking_statistics` (
`total_bookings` bigint(21)
,`total_tickets` decimal(32,0)
,`total_revenue` decimal(32,2)
,`confirmed_bookings` bigint(21)
,`pending_bookings` bigint(21)
,`cancelled_bookings` bigint(21)
,`today_bookings` bigint(21)
,`this_week_bookings` bigint(21)
,`this_month_bookings` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(100) NOT NULL,
  `venue_name` varchar(255) DEFAULT NULL,
  `venue_address` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` varchar(50) NOT NULL,
  `end_time` varchar(50) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `ticket_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ticket_types`)),
  `total_seats` int(11) DEFAULT 100,
  `available_seats` int(11) DEFAULT 100,
  `status` enum('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  `is_active` tinyint(1) DEFAULT 1,
  `featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `location`, `venue_name`, `venue_address`, `event_date`, `event_time`, `end_time`, `duration`, `category`, `image_url`, `ticket_types`, `total_seats`, `available_seats`, `status`, `is_active`, `featured`, `created_at`, `updated_at`) VALUES
(1, 'MEDAI Live: Comedy Night', 'An evening of laughter with top comedians and AI-generated humor', 'Chennai', 'Phoenix MarketCity', 'Velachery Main Rd, Chennai', '2026-03-15', '7:00 PM', '10:00 PM', NULL, 'Comedy', NULL, '[{\"type\":\"General Admission\",\"price\":500,\"description\":\"Standard seating\"},{\"type\":\"VIP\",\"price\":1500,\"description\":\"Premium seating with complimentary drinks\"},{\"type\":\"Premium\",\"price\":2500,\"description\":\"Front row seats with meet & greet\"}]', 200, 150, 'upcoming', 1, 1, '2026-02-26 10:45:51', '2026-02-26 10:45:51'),
(2, 'MEDAI Experience: Bengaluru', 'Interactive performance with real-time AI visuals and spatial audio', 'Bengaluru', 'Orion Mall', 'Brigade Gateway, Rajajinagar', '2026-03-20', '8:00 PM', '11:00 PM', NULL, 'Performance', NULL, '[{\"type\":\"General Admission\",\"price\":600,\"description\":\"Standard seating\"},{\"type\":\"VIP\",\"price\":1800,\"description\":\"Premium seating with complimentary drinks\"}]', 150, 120, 'upcoming', 1, 1, '2026-02-26 10:45:51', '2026-02-26 10:45:51'),
(3, 'MEDAI Showcase: Coimbatore', 'Sensory marvel combining comedy, music, and technology', 'Coimbatore', 'Brookefields Mall', 'Avinashi Road, Coimbatore', '2026-03-25', '6:30 PM', '9:30 PM', NULL, 'Showcase', NULL, '[{\"type\":\"General Admission\",\"price\":450,\"description\":\"Standard seating\"},{\"type\":\"VIP\",\"price\":1200,\"description\":\"Premium seating\"}]', 100, 80, 'upcoming', 1, 0, '2026-02-26 10:45:51', '2026-02-26 10:45:51');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) NOT NULL,
  `category` varchar(100) DEFAULT 'General',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('contact_email', 'ajayselvaas6@gmail.com', '2026-03-02 12:34:40'),
('contact_phone', '+91 7418529630', '2026-03-02 12:34:40');

-- --------------------------------------------------------

--
-- Table structure for table `slot_management`
--

CREATE TABLE `slot_management` (
  `id` int(11) NOT NULL,
  `slot_id` int(11) NOT NULL,
  `specific_date` date NOT NULL,
  `override_price` decimal(10,2) DEFAULT NULL,
  `is_blocked` tinyint(1) DEFAULT 0,
  `block_reason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `venue_slots`
--

CREATE TABLE `venue_slots` (
  `id` int(11) NOT NULL,
  `location` varchar(50) NOT NULL,
  `slot_code` varchar(10) NOT NULL,
  `slot_range` varchar(50) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venue_slots`
--

INSERT INTO `venue_slots` (`id`, `location`, `slot_code`, `slot_range`, `duration`, `base_price`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'CHENNAI', 'C1', '07:00 AM – 10:00 AM', '3 Hours', 1.00, 1, '2026-03-04 10:16:48', '2026-03-04 10:16:48'),
(2, 'CHENNAI', 'C2', '11:00 AM – 02:00 PM', '3 Hours', 15000.00, 1, '2026-03-04 10:16:48', '2026-03-04 10:16:48'),
(3, 'CHENNAI', 'C3', '03:00 PM – 06:00 PM', '3 Hours', 15000.00, 1, '2026-03-04 10:16:48', '2026-03-04 10:16:48'),
(4, 'CHENNAI', 'C4', '07:00 PM – 10:00 PM', '3 Hours', 15000.00, 1, '2026-03-04 10:16:48', '2026-03-04 10:16:48'),
(5, 'BENGALURU', 'B1', '03:00 PM – 09:00 PM', '6 Hours', 45000.00, 1, '2026-03-04 10:16:48', '2026-03-04 10:16:48'),
(6, 'BENGALURU', 'B2', '08:00 AM – 02:00 PM', '6 Hours', 45000.00, 1, '2026-03-04 10:16:48', '2026-03-04 10:16:48'),
(7, 'COIMBATORE', 'CB1', '08:00 AM – 02:00 PM', '6 Hours', 30000.00, 1, '2026-03-04 10:16:48', '2026-03-04 10:16:48'),
(8, 'COIMBATORE', 'CB2', '03:00 PM – 09:00 PM', '6 Hours', 30000.00, 1, '2026-03-04 10:16:48', '2026-03-04 10:16:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_id` (`admin_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_reference` (`booking_reference`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_booking_ref` (`booking_reference`),
  ADD KEY `idx_location` (`location`),
  ADD KEY `idx_event_date` (`event_date`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_event_id` (`event_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_location` (`location`),
  ADD KEY `idx_event_date` (`event_date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `slot_management`
--
ALTER TABLE `slot_management`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slot_id` (`slot_id`,`specific_date`),
  ADD KEY `idx_date` (`specific_date`);

--
-- Indexes for table `venue_slots`
--
ALTER TABLE `venue_slots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_location` (`location`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `slot_management`
--
ALTER TABLE `slot_management`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `venue_slots`
--
ALTER TABLE `venue_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

-- --------------------------------------------------------

--
-- Structure for view `booking_statistics`
--
DROP TABLE IF EXISTS `booking_statistics`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u891495087_medai_db1`@`127.0.0.1` SQL SECURITY DEFINER VIEW `booking_statistics`  AS SELECT count(0) AS `total_bookings`, sum(`bookings`.`quantity`) AS `total_tickets`, sum(`bookings`.`total_amount`) AS `total_revenue`, count(case when `bookings`.`booking_status` = 'confirmed' then 1 end) AS `confirmed_bookings`, count(case when `bookings`.`booking_status` = 'pending' then 1 end) AS `pending_bookings`, count(case when `bookings`.`booking_status` = 'cancelled' then 1 end) AS `cancelled_bookings`, count(case when cast(`bookings`.`created_at` as date) = curdate() then 1 end) AS `today_bookings`, count(case when week(`bookings`.`created_at`) = week(curdate()) then 1 end) AS `this_week_bookings`, count(case when month(`bookings`.`created_at`) = month(curdate()) then 1 end) AS `this_month_bookings` FROM `bookings` ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `slot_management`
--
ALTER TABLE `slot_management`
  ADD CONSTRAINT `slot_management_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `venue_slots` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
