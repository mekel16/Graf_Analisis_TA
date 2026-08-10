# Prediksi Capaian Nilai Siswa (Rural vs Urban) menggunakan GNN & SHAP

Proyek ini adalah implementasi dari skripsi berjudul **"Analisis Faktor Pengaruh pada Prediksi Capaian Nilai Siswa Daerah Rural-Urban di Indonesia Timur Menggunakan Graph Neural Network-Shapley Additive Explanations"** oleh **Michael Luwi Pallea'** (Sains Data - Universitas Negeri Surabaya, 2026).

## Deskripsi Singkat
Proyek ini bertujuan untuk membandingkan dan menganalisis faktor-faktor apa saja yang paling memengaruhi prestasi siswa di daerah pedesaan (*rural*) dan perkotaan (*urban*) di kawasan Indonesia Timur. 

Karena data pendidikan memiliki hubungan yang kompleks (contoh: siswa bersekolah di sekolah yang sama atau diajar oleh guru yang sama), proyek ini mengubah data tabel biasa menjadi bentuk **Graf (Jaringan)**. Algoritma Kecerdasan Buatan (AI) bernama **Graph Neural Network (GNN)** kemudian digunakan untuk memprediksi capaian nilai siswa, dan metode **SHAP** digunakan untuk menjelaskan mengapa model AI tersebut memberikan prediksi sedemikian rupa.

## Data yang Digunakan
Data berasal dari **Asesmen Nasional (AN) 2024**. Terdiri dari 2.162 siswa (1.329 dari rural dan 833 dari urban). Data ini dipetakan menjadi 4 jenis titik (simpul) di dalam jaringan graf:
- **Siswa**: (fasilitas belajar di rumah, akses internet, dll.)
- **Sekolah**: (jumlah guru bersertifikasi, kepadatan kelas, fasilitas sekolah, dll.)
- **Orang Tua**: (tingkat pendidikan dan jenis pekerjaan)
- **Wilayah**: (status rural atau urban)

## Cara Kerja (Metodologi)
1. **Pembuatan Graf**: Data siswa dan lingkungannya dihubungkan satu sama lain membentuk sebuah jaringan (*Heterogeneous Graph*).
2. **Pemodelan GNN**: AI mempelajari pola dari jaringan tersebut untuk mengklasifikasikan siswa ke dalam capaian nilai Rendah, Cukup, atau Tinggi.
3. **Analisis dengan SHAP**: Mengekstrak alasan dari AI untuk mengetahui faktor mana yang paling berdampak positif maupun negatif terhadap nilai siswa.

## Temuan Penting (Insights)
- **Kondisi Sekolah Adalah Kunci**: Baik di desa maupun di kota, faktor dari dalam sekolah (terutama *Jumlah Siswa per Rombel* atau kepadatan kelas) adalah penentu paling kuat terhadap capaian siswa.
- **Kondisi Desa (Rural)**: Hambatan ekonomi keluarga (seperti banyaknya siswa penerima bantuan PIP) adalah faktor pendorong terbesar kedua. Selain itu, latar belakang pendidikan ayah sangat membantu mendongkrak nilai siswa di desa untuk menutupi kekurangan fasilitas sekolah.
- **Kondisi Kota (Urban)**: Skala sekolah (total jumlah murid) menjadi sangat dominan. Kepadatan kelas di sekolah favorit perkotaan yang kompetitif justru mendorong siswa untuk meraih nilai tertinggi.

--