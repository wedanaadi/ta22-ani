-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2022 at 12:09 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ta22ani`
--

-- --------------------------------------------------------

--
-- Table structure for table `absens`
--

CREATE TABLE `absens` (
  `id_absen` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pegawai_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `keterangan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `absens`
--

INSERT INTO `absens` (`id_absen`, `pegawai_id`, `tanggal`, `keterangan`, `created_at`) VALUES
('1706aff0-6e3a-11ed-90b0-ebc050d59556', 'P221100001', '2022-11-01', 'Hadir', 1669543129183),
('170817e0-6e3a-11ed-bc66-cf77825d6f00', 'P221100001', '2022-11-02', 'Hadir', 1669543129192),
('170838e0-6e3a-11ed-9fea-67fbfc224da5', 'P221100001', '2022-11-03', 'Hadir', 1669543129193),
('17085930-6e3a-11ed-b44b-e302681ae1a7', 'P221100001', '2022-11-04', 'Hadir', 1669543129194),
('17088770-6e3a-11ed-a789-11c6ad9df68e', 'P221100001', '2022-11-05', 'Hadir', 1669543129195),
('1708ade0-6e3a-11ed-a761-9b3cb4f59d44', 'P221100001', '2022-11-07', 'Hadir', 1669543129196),
('1708ceb0-6e3a-11ed-9da0-114ad314b607', 'P221100001', '2022-11-08', 'Hadir', 1669543129197),
('1708f040-6e3a-11ed-9945-157a70b6cd38', 'P221100001', '2022-11-09', 'Hadir', 1669543129197),
('17090c00-6e3a-11ed-ad8c-97bd6462586d', 'P221100001', '2022-11-10', 'Hadir', 1669543129198),
('170928c0-6e3a-11ed-83aa-6d193ab6e115', 'P221100001', '2022-11-11', 'Hadir', 1669543129199),
('17096630-6e3a-11ed-8b96-9f6562f3352b', 'P221100001', '2022-11-12', 'Hadir', 1669543129201),
('170996b0-6e3a-11ed-90e5-1919f7b22fd2', 'P221100001', '2022-11-14', 'Hadir', 1669543129202),
('1709b620-6e3a-11ed-93a2-4f3a7cc67746', 'P221100001', '2022-11-15', 'Hadir', 1669543129203),
('1709d1c0-6e3a-11ed-8bb2-ad292d46c834', 'P221100001', '2022-11-16', 'Hadir', 1669543129203),
('1709f290-6e3a-11ed-bba3-9db05e9ff71e', 'P221100001', '2022-11-17', 'Hadir', 1669543129204),
('170a1ba0-6e3a-11ed-affa-5dc4874f87b2', 'P221100001', '2022-11-18', 'Hadir', 1669543129205),
('170a3f80-6e3a-11ed-bc3a-83cd0960cfb4', 'P221100001', '2022-11-19', 'Hadir', 1669543129206),
('170a6220-6e3a-11ed-ac01-fd89aeae8003', 'P221100001', '2022-11-21', 'Hadir', 1669543129207),
('170a8580-6e3a-11ed-8279-217364051916', 'P221100001', '2022-11-22', 'Hadir', 1669543129208),
('170aaab0-6e3a-11ed-9d35-85e1413dfc7c', 'P221100001', '2022-11-23', 'Hadir', 1669543129209),
('170acdf0-6e3a-11ed-901c-cf456db5fb60', 'P221100001', '2022-11-24', 'Hadir', 1669543129210),
('170aed80-6e3a-11ed-ad34-8515688462f0', 'P221100001', '2022-11-25', 'Hadir', 1669543129210),
('170b0750-6e3a-11ed-ba33-ed7b0d5c9d8b', 'P221100001', '2022-11-26', 'Hadir', 1669543129211);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id_comment` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gaji_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pegawai_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id_comment`, `gaji_id`, `created_at`, `comment`, `pegawai_id`, `is_read`) VALUES
('9f262a00-6ea4-11ed-b515-e7689d84312b', '68e6a150-6e3a-11ed-a2c1-530ac60d1d38', 1669588884214, 'Potongan Darimana ?', 'P221100001', 1),
('d1912630-6ea4-11ed-8cfb-9b134ef497de', '68e6a150-6e3a-11ed-a2c1-530ac60d1d38', 1669588968800, 'Dari Tidak Masuk dengan alasan yang tidak jelas', 'P221100003', 0);

-- --------------------------------------------------------

--
-- Table structure for table `cutis`
--

CREATE TABLE `cutis` (
  `id_cuti` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pegawai_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `alasan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `is_aprove` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cutis`
--

INSERT INTO `cutis` (`id_cuti`, `pegawai_id`, `tanggal_mulai`, `tanggal_selesai`, `alasan`, `created_at`, `is_aprove`) VALUES
('e9827df0-6e23-11ed-89ad-c3230d5485be', 'P221100001', '2022-11-29', '2022-11-29', 'Upacara Agama (Odalan)', 1669533603891, 0);

-- --------------------------------------------------------

--
-- Table structure for table `gajis`
--

CREATE TABLE `gajis` (
  `id_gaji` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `periode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pegawai_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_hadir` int(11) NOT NULL,
  `gaji_pokok` int(11) NOT NULL,
  `gaji_harian` int(11) NOT NULL,
  `tunjangan` int(11) NOT NULL,
  `bonus` int(11) NOT NULL,
  `potongan` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `is_valid` int(11) NOT NULL DEFAULT 0,
  `created_at` bigint(20) NOT NULL,
  `tunjangan_harian` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gajis`
--

INSERT INTO `gajis` (`id_gaji`, `periode`, `pegawai_id`, `total_hadir`, `gaji_pokok`, `gaji_harian`, `tunjangan`, `bonus`, `potongan`, `total`, `is_valid`, `created_at`, `tunjangan_harian`) VALUES
('68e6a150-6e3a-11ed-a2c1-530ac60d1d38', '1667232000000', 'P221100001', 23, 2800000, 2476923, 200000, 100000, 0, 2753846, 1, 1669543266546, 176923);

-- --------------------------------------------------------

--
-- Table structure for table `jabatans`
--

CREATE TABLE `jabatans` (
  `id_jabatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_jabatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gaji_pokok` int(11) NOT NULL,
  `tunjangan` int(11) NOT NULL,
  `created_at` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jabatans`
--

INSERT INTO `jabatans` (`id_jabatan`, `nama_jabatan`, `gaji_pokok`, `tunjangan`, `created_at`) VALUES
('040b33c0-6a1d-11ed-b88d-2fb3d0108519', 'Admin', 2800000, 200000, 1669090837280),
('04bb8f90-6c65-11ed-a689-db8199be6d6a', 'HRD', 2800000, 200000, 1669341664525),
('0fa4c340-6a53-11ed-b733-bf2ffd7bb059', 'Teknisi', 2800000, 200000, 1669114049564),
('233a2590-6a53-11ed-9ad5-ab5caf8dcd52', 'Staff', 2200000, 200000, 1669114082420),
('fa5c6980-6c64-11ed-8f89-05c491f53762', 'Pimpinan', 2800000, 200000, 1669341647126);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(2, '2022_11_22_110351_create_jabatans_table', 2),
(3, '2022_11_22_110055_create_pegawais_table', 3),
(4, '2014_10_12_000000_create_users_table', 4),
(5, '2022_11_23_141641_create_cutis_table', 5),
(6, '2022_11_23_192017_create_absens_table', 6),
(7, '2022_11_24_013600_create_gajis_table', 7),
(8, '2022_11_24_191024_create_comments_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `pegawais`
--

CREATE TABLE `pegawais` (
  `id_pegawai` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_pegawai` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tempat_lahir` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('P','L') COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pendidikan` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_telepon` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_pegawai` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `is_aktif` tinyint(4) DEFAULT 1,
  `nik` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pegawais`
--

INSERT INTO `pegawais` (`id_pegawai`, `nama_pegawai`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `agama`, `status`, `pendidikan`, `no_telepon`, `foto`, `jabatan_id`, `status_pegawai`, `created_at`, `is_aktif`, `nik`) VALUES
('P221100001', 'Ida Bagus Adi Wedana Manuaba', 'Jembrana', '1996-11-02', 'L', 'Jl. Gn. Muliawan No 1 Gianyar', 'Hindu', '1', 'S1', '089669724863', 'P221100001=pic4.jpg', '040b33c0-6a1d-11ed-b88d-2fb3d0108519', '1', 1669532065251, 1, 5104030211960001),
('P221100002', 'Putu Utama Arta', 'Batubulan', '1996-12-16', 'L', 'Batubulan Gianyar', 'Katolik', '1', 'S1', '087343653646', 'P221100002=pic2.jpg', '0fa4c340-6a53-11ed-b733-bf2ffd7bb059', '1', 1669532204484, 1, 5104051612960001),
('P221100003', 'Ni Putu Natalia Sari', 'Klungkung', '1998-10-11', 'P', 'Dawan Klungkung', 'Hindu', '1', 'D1', '085737437876', 'P221100003=pic5.jpg', '04bb8f90-6c65-11ed-a689-db8199be6d6a', '1', 1669532338102, 1, 2147483647),
('P221100004', 'Antonius Junior Liem', 'Denpasar', '1990-02-05', 'L', 'Denpasar', 'Protestan', '1', 'S2', '087453636', 'P221100004=1.jpg', 'fa5c6980-6c64-11ed-8f89-05c491f53762', '1', 1669532424864, 1, 2147483647);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pegawai_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `hak_akses` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `pegawai_id`, `created_at`, `hak_akses`) VALUES
('58197060-6e22-11ed-9dec-9f0ffe9de07f', 'pegawai', '$2y$10$Lr.lYfVIo8..ffB4G7Da3.pEIEaiJqg5ME73nWZs6fgKo8UIdkt9m', 'P221100002', 1669532930524, 3),
('804fa300-6c66-11ed-ae4e-edd566a8fdc5', 'hrd', '$2y$10$uacG1p8xFxork6p3ju6qRulV1BFV0e7PQi8wiC7iArIl1OerOYRze', 'P221100003', 1669342301432, 2),
('94b70e30-6c66-11ed-906e-2bb98a34444f', 'pimpinan', '$2y$10$ddXwCre86UoTZhVOLxpbvuup68oM7nezfElNKlpUow.zIE.B9giqi', 'P221100004', 1669342335671, 4),
('c3279430-6bf2-11ed-8859-c77bb3d7ca88', 'admin', '$2y$10$.CbaaGVldI8zM4YGj1m3Reh8fnMFcZHWlOl/5lcOnwjvRgRGCh5Da', 'P221100001', 1669292591971, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absens`
--
ALTER TABLE `absens`
  ADD PRIMARY KEY (`id_absen`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id_comment`);

--
-- Indexes for table `cutis`
--
ALTER TABLE `cutis`
  ADD PRIMARY KEY (`id_cuti`);

--
-- Indexes for table `gajis`
--
ALTER TABLE `gajis`
  ADD PRIMARY KEY (`id_gaji`);

--
-- Indexes for table `jabatans`
--
ALTER TABLE `jabatans`
  ADD PRIMARY KEY (`id_jabatan`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pegawais`
--
ALTER TABLE `pegawais`
  ADD PRIMARY KEY (`id_pegawai`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
