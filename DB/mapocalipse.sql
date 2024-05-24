-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mag 24, 2024 alle 15:44
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mapocalipse`
--
CREATE DATABASE IF NOT EXISTS `mapocalipse` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mapocalipse`;

-- --------------------------------------------------------

--
-- Struttura della tabella `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add user', 6, 'add_user'),
(22, 'Can change user', 6, 'change_user'),
(23, 'Can delete user', 6, 'delete_user'),
(24, 'Can view user', 6, 'view_user'),
(25, 'Can add single player lobby', 7, 'add_singleplayerlobby'),
(26, 'Can change single player lobby', 7, 'change_singleplayerlobby'),
(27, 'Can delete single player lobby', 7, 'delete_singleplayerlobby'),
(28, 'Can view single player lobby', 7, 'view_singleplayerlobby'),
(29, 'Can add coordinates', 8, 'add_coordinates'),
(30, 'Can change coordinates', 8, 'change_coordinates'),
(31, 'Can delete coordinates', 8, 'delete_coordinates'),
(32, 'Can view coordinates', 8, 'view_coordinates'),
(33, 'Can add multi player lobby', 9, 'add_multiplayerlobby'),
(34, 'Can change multi player lobby', 9, 'change_multiplayerlobby'),
(35, 'Can delete multi player lobby', 9, 'delete_multiplayerlobby'),
(36, 'Can view multi player lobby', 9, 'view_multiplayerlobby'),
(37, 'Can add lobby user', 10, 'add_lobbyuser'),
(38, 'Can change lobby user', 10, 'change_lobbyuser'),
(39, 'Can delete lobby user', 10, 'delete_lobbyuser'),
(40, 'Can view lobby user', 10, 'view_lobbyuser'),
(41, 'Can add coordinates', 11, 'add_coordinates'),
(42, 'Can change coordinates', 11, 'change_coordinates'),
(43, 'Can delete coordinates', 11, 'delete_coordinates'),
(44, 'Can view coordinates', 11, 'view_coordinates');

-- --------------------------------------------------------

--
-- Struttura della tabella `coordinates`
--

DROP TABLE IF EXISTS `coordinates`;
CREATE TABLE IF NOT EXISTS `coordinates` (
  `coordinate_id` int(11) NOT NULL AUTO_INCREMENT,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `lobby_id` varchar(6) NOT NULL,
  PRIMARY KEY (`coordinate_id`),
  KEY `coordinates_lobby_id_966379b2_fk_singleplayer_lobbies_lobby_id` (`lobby_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=296 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(6, 'authentication', 'user'),
(4, 'contenttypes', 'contenttype'),
(11, 'multiplayer', 'coordinates'),
(10, 'multiplayer', 'lobbyuser'),
(9, 'multiplayer', 'multiplayerlobby'),
(5, 'sessions', 'session'),
(8, 'singleplayer', 'coordinates'),
(7, 'singleplayer', 'singleplayerlobby');

-- --------------------------------------------------------

--
-- Struttura della tabella `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2024-04-29 19:49:20.060719'),
(2, 'contenttypes', '0002_remove_content_type_name', '2024-04-29 19:49:20.107305'),
(3, 'auth', '0001_initial', '2024-04-29 19:49:20.321781'),
(4, 'auth', '0002_alter_permission_name_max_length', '2024-04-29 19:49:20.371870'),
(5, 'auth', '0003_alter_user_email_max_length', '2024-04-29 19:49:20.376875'),
(6, 'auth', '0004_alter_user_username_opts', '2024-04-29 19:49:20.380889'),
(7, 'auth', '0005_alter_user_last_login_null', '2024-04-29 19:49:20.395410'),
(8, 'auth', '0006_require_contenttypes_0002', '2024-04-29 19:49:20.397915'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2024-04-29 19:49:20.402431'),
(10, 'auth', '0008_alter_user_username_max_length', '2024-04-29 19:49:20.406434'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2024-04-29 19:49:20.410451'),
(12, 'auth', '0010_alter_group_name_max_length', '2024-04-29 19:49:20.419970'),
(13, 'auth', '0011_update_proxy_permissions', '2024-04-29 19:49:20.424473'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2024-04-29 19:49:20.428988'),
(15, 'authentication', '0001_initial', '2024-04-29 19:49:20.684036'),
(16, 'admin', '0001_initial', '2024-04-29 19:49:20.794800'),
(17, 'admin', '0002_logentry_remove_auto_add', '2024-04-29 19:49:20.800314'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2024-04-29 19:49:20.805318'),
(19, 'authentication', '0002_user_usercode', '2024-04-29 19:49:20.852924'),
(20, 'sessions', '0001_initial', '2024-04-29 19:49:20.879498'),
(21, 'chat', '0001_initial', '2024-05-07 19:06:10.482041'),
(22, 'chat', '0002_remove_message_chat_remove_message_user_delete_chat_and_more', '2024-05-07 19:06:10.770772'),
(31, 'singleplayer', '0001_initial', '2024-05-08 19:25:15.293560'),
(32, 'singleplayer', '0002_singleplayerlobby_points', '2024-05-09 17:11:06.029236'),
(33, 'singleplayer', '0003_alter_singleplayerlobby_gamemode', '2024-05-10 15:57:06.487372'),
(34, 'authentication', '0002_alter_user_username', '2024-05-21 16:34:30.331942'),
(35, 'multiplayer', '0001_initial', '2024-05-21 16:34:30.470061'),
(36, 'multiplayer', '0002_lobbyuser_round_distance', '2024-05-21 17:01:56.158741'),
(37, 'multiplayer', '0003_multiplayerlobby_rounds', '2024-05-22 21:03:51.555356'),
(38, 'multiplayer', '0004_alter_lobbyuser_user', '2024-05-22 21:51:13.835300'),
(39, 'multiplayer', '0005_lobbyuser_role', '2024-05-23 13:41:48.135577');

-- --------------------------------------------------------

--
-- Struttura della tabella `django_session`
--

DROP TABLE IF EXISTS `django_session`;
CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('eczvzpub90z2hyqayztgr3xc783nwqbj', '.eJxVjr0OwjAQg98lM4p6TUMvjMxlRmKJLrmDFqpG6s-AEO9OKjrA4sH-bPmlPC1z65dJRt-xOqhS7X69QPEhwxrwnYZb0jEN89gFvSJ6Syd9Siz9cWP_Blqa2twGIyRYsSEiZEeFuEAuZiFmBzUAixEORRVZHF6BSyS09d5CJg3m0T6F8PyePNvmAqjeH9f9PvQ:1sAUuS:7nHXGI5-JLznUDPuuEUqw_xCbsNJhZsduHLqwe3dJSI', '2024-06-07 13:24:36.282686'),
('prbs03mih0zlsa6k506bhno2cgc4aya0', '.eJxVjksKwkAQRO8yaxmczvziTkFw4xlCd0_HREMG8lmIeHcTzEK39aoe9VIVzlNTzaMMVZvUQRVq95sR8kP6FaQ79resOffT0JJeK3qjo77mJN1p6_4JGhybZW1c6aOJwhGdJRQAZKh9YABHVEJpvBMIHG0wNVjhxGhYYhRLxR79Iu0y0fN78hLiEc7q_QF6Jj2k:1sAUx1:h4uf-D-8BK7nAA2046hLDuYq1k8zW71gObPvpc5JAEY', '2024-06-07 13:27:15.939324');

-- --------------------------------------------------------

--
-- Struttura della tabella `lobby_users`
--

DROP TABLE IF EXISTS `lobby_users`;
CREATE TABLE IF NOT EXISTS `lobby_users` (
  `lobby_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `round_finished` tinyint(1) NOT NULL,
  `points` int(11) NOT NULL,
  `lobby_id` varchar(6) NOT NULL,
  `round_distance` double NOT NULL,
  `role` varchar(6) NOT NULL,
  PRIMARY KEY (`lobby_user_id`),
  KEY `lobby_users_lobby_id_1b985e13_fk_multiplayer_lobbies_lobby_id` (`lobby_id`),
  KEY `lobby_users_user_id_ff744206` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `multiplayer_coordinates`
--

DROP TABLE IF EXISTS `multiplayer_coordinates`;
CREATE TABLE IF NOT EXISTS `multiplayer_coordinates` (
  `coordinate_id` int(11) NOT NULL AUTO_INCREMENT,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `lobby_id` varchar(6) NOT NULL,
  PRIMARY KEY (`coordinate_id`),
  KEY `multiplayer_coordina_lobby_id_2fa0d83a_fk_multiplay` (`lobby_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `multiplayer_lobbies`
--

DROP TABLE IF EXISTS `multiplayer_lobbies`;
CREATE TABLE IF NOT EXISTS `multiplayer_lobbies` (
  `lobby_id` varchar(6) NOT NULL,
  `gamemode` varchar(20) NOT NULL,
  `coordinatesindex` int(11) NOT NULL,
  `time_duration` bigint(20) NOT NULL,
  `rounds` int(11) NOT NULL,
  PRIMARY KEY (`lobby_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `singleplayer_lobbies`
--

DROP TABLE IF EXISTS `singleplayer_lobbies`;
CREATE TABLE IF NOT EXISTS `singleplayer_lobbies` (
  `lobby_id` varchar(6) NOT NULL,
  `gamemode` varchar(20) NOT NULL,
  `coordinatesindex` int(11) NOT NULL,
  `time_duration` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `points` int(11) NOT NULL,
  PRIMARY KEY (`lobby_id`),
  KEY `singleplayer_lobbies_user_id_2091d915_fk_users_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `singleplayer_lobbies`
--

INSERT INTO `singleplayer_lobbies` (`lobby_id`, `gamemode`, `coordinatesindex`, `time_duration`, `user_id`, `points`) VALUES
('KFAMCJ', 'timelimit', 0, 300000000, 2, 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_login` datetime(6) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(32) NOT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `usercode` varchar(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `usercode` (`usercode`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `last_login`, `username`, `password`, `email`, `first_name`, `last_name`, `is_superuser`, `usercode`) VALUES
(2, '2024-05-24 12:47:47.629825', 'yes', 'a6105c0a611b41b08f1209506350279e', 'yes@yes.yes', 'yes', 'yes', 0, 'XNUXBG'),
(3, '2024-05-24 11:56:11.138825', 'no', '7fa3b767c460b54a2be4d49030b349c7', 'no@no.no', 'no', 'no', 0, 'PVMOZI');

-- --------------------------------------------------------

--
-- Struttura della tabella `users_groups`
--

DROP TABLE IF EXISTS `users_groups`;
CREATE TABLE IF NOT EXISTS `users_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_groups_user_id_group_id_fc7788e8_uniq` (`user_id`,`group_id`),
  KEY `users_groups_group_id_2f3517aa_fk_auth_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `users_user_permissions`
--

DROP TABLE IF EXISTS `users_user_permissions`;
CREATE TABLE IF NOT EXISTS `users_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_permissions_user_id_permission_id_3b86cbdf_uniq` (`user_id`,`permission_id`),
  KEY `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Limiti per la tabella `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Limiti per la tabella `coordinates`
--
ALTER TABLE `coordinates`
  ADD CONSTRAINT `coordinates_lobby_id_966379b2_fk_singleplayer_lobbies_lobby_id` FOREIGN KEY (`lobby_id`) REFERENCES `singleplayer_lobbies` (`lobby_id`);

--
-- Limiti per la tabella `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `lobby_users`
--
ALTER TABLE `lobby_users`
  ADD CONSTRAINT `lobby_users_lobby_id_1b985e13_fk_multiplayer_lobbies_lobby_id` FOREIGN KEY (`lobby_id`) REFERENCES `multiplayer_lobbies` (`lobby_id`),
  ADD CONSTRAINT `lobby_users_user_id_ff744206_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `multiplayer_coordinates`
--
ALTER TABLE `multiplayer_coordinates`
  ADD CONSTRAINT `multiplayer_coordina_lobby_id_2fa0d83a_fk_multiplay` FOREIGN KEY (`lobby_id`) REFERENCES `multiplayer_lobbies` (`lobby_id`);

--
-- Limiti per la tabella `singleplayer_lobbies`
--
ALTER TABLE `singleplayer_lobbies`
  ADD CONSTRAINT `singleplayer_lobbies_user_id_2091d915_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `users_groups`
--
ALTER TABLE `users_groups`
  ADD CONSTRAINT `users_groups_group_id_2f3517aa_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `users_groups_user_id_f500bee5_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  ADD CONSTRAINT `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `users_user_permissions_user_id_92473840_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
